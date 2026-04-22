import 'dotenv/config';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'merlin-hub-secret-2026';

// Supabase Admin Client (환경변수 필수)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// [Refactored] 기존 메모리 기반 otpStore 삭제 후 DB 방식 도입

export const AuthService = {
  // 1. OTP 요청 및 발송
  requestOTP: async (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5분 유효

    // [DB 저장] family_otp 테이블에 기록
    if (supabase) {
      await supabase.from('family_otp').insert({
        email,
        otp_code: code,
        expires_at
      });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: 'Merlin Hub <onboarding@resend.dev>',
        to: [email],
        subject: '[Merlin Hub] 인증 코드가 도착했습니다',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2d5af0;">Merlin Hub Authentication</h2>
            <p>안녕하세요, 멀린 패밀리 앱 로그인을 위한 인증 코드입니다.</p>
            <div style="font-size: 32px; font-weight: bold; color: #2d5af0; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #666; font-size: 12px;">이 코드는 5분 동안 유효합니다.</p>
          </div>
        `
      });

      if (error) {
        throw new Error(`이메일 발송 실패: ${error.message}`);
      }
      
      return { success: true, message: '인증 코드가 발송되었습니다.' };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 2. OTP 검증 및 JWT 발급
  verifyOTP: async (email: string, code: string, appId?: string) => {
    if (!supabase) throw new Error('DB 연결이 설정되지 않았습니다.');

    // [DB 검증] family_otp 테이블에서 조회
    const now = new Date().toISOString();
    console.log(`[Auth] Verifying OTP for ${email}, code: ${code}, now: ${now}`);

    const { data: otpRecord, error } = await supabase
      .from('family_otp')
      .select('*')
      .eq('email', email)
      .eq('otp_code', code)
      .single();

    if (error) {
      console.error(`❌ OTP Lookup Error: ${error.message}`);
      throw new Error('인증 코드 확인 중 오류가 발생했습니다.');
    }

    if (!otpRecord) {
      console.warn(`🛑 Invalid OTP attempt for ${email} with code ${code}`);
      throw new Error('인증 코드가 올바르지 않습니다.');
    }

    // 만료 확인
    const expiresAt = new Date(otpRecord.expires_at);
    const currentTime = new Date();
    if (expiresAt < currentTime) {
      console.warn(`🛑 Expired OTP for ${email}. Expired at: ${otpRecord.expires_at}, Current: ${currentTime.toISOString()}`);
      throw new Error('인증 코드가 만료되었습니다.');
    }

    console.log(`✅ OTP Verified for ${email}. Proceeding to user persistence...`);

    // 검증 성공 후 기록 삭제 (1회용)
    await supabase.from('family_otp').delete().eq('id', otpRecord.id);

    let familyUid = '';
    
    // [DB 연동] 사용자 생성 및 조회
    if (supabase) {
      // 1. 기존 유저 확인
      console.log(`[Auth] Checking existing user for ${email}...`);
      const { data: user, error: fetchError } = await supabase
        .from('family_users')
        .select('*')
        .eq('email', email)
        .single();

      if (user) {
        console.log(`[Auth] Existing user found: ${user.family_uid}`);
        familyUid = user.family_uid;
      } else {
        // 2. 신규 유저 생성
        console.log(`[Auth] Creating new user for ${email}...`);
        familyUid = `mfn-${Math.random().toString(36).substr(2, 9)}`;
        const { data: newUser, error: insertError } = await supabase.from('family_users').insert({
          email,
          family_uid: familyUid,
          nickname: email.split('@')[0],
          first_app_id: appId || 'UNKNOWN'
        }).select().single();
        
        if (insertError) {
          console.error('[Auth] Failed to create user:', insertError.message);
          throw new Error('유저 생성에 실패했습니다.');
        }
        console.log(`[Auth] New user created: ${familyUid}`);
      }

      // 4. 앱별 가입 이력 기록 (에러 방지를 위해 email 필드 제거)
      if (appId) {
        console.log(`[Auth] Logging registration for app: ${appId}`);
        // 다시 한번 유저 ID 확보
        const { data: userData } = await supabase.from('family_users').select('id').eq('email', email).single();
        
        if (userData) {
          const { error: regError } = await supabase.from('family_user_registrations').upsert({
            user_id: userData.id,
            app_id: appId,
            reward_stage: 1,
            last_registered_at: new Date().toISOString()
          }, { onConflict: 'user_id, app_id' });

          if (regError) console.error('[Auth] Registration log failed:', regError.message);
        }
      }
    } else {
      familyUid = `mfn-${Math.random().toString(36).substr(2, 9)}`; // DB 없을 때 폴백
    }

    // JWT 발행
    const token = jwt.sign(
      { email, familyUid, iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      familyUid,
      email,
      nickname: email.split('@')[0]
    };
  },

  // 3. 토큰 검증
  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
      return null;
    }
  },

  // 4. 프로필 정보 업데이트
  updateProfile: async (email: string, data: { nickname?: string; avatar_url?: string }) => {
    if (!supabase) throw new Error('DB 연결이 설정되지 않았습니다.');
    
    console.log(`[Auth] Attempting profile update for ${email}:`, data);

    const updateData: any = {
      nickname: data.nickname,
      updated_at: new Date().toISOString()
    };
    
    // avatar_url이 있을 때만 추가 (컬럼 존재 여부 불확실성 대비)
    if (data.avatar_url) {
      updateData.avatar_url = data.avatar_url;
    }

    const { error } = await supabase
      .from('family_users')
      .update(updateData)
      .eq('email', email);

    if (error) {
      console.error('[Auth] Profile update failed details:', error);
      
      // 만약 avatar_url 컬럼이 없어서 실패한 거라면 nickname만 재시도
      if (error.message.includes('column') && error.message.includes('avatar_url')) {
        console.warn('[Auth] avatar_url column missing, retrying with nickname only...');
        const { error: retryError } = await supabase
          .from('family_users')
          .update({ nickname: data.nickname, updated_at: new Date().toISOString() })
          .eq('email', email);
          
        if (!retryError) return { success: true, message: 'Nickname updated (avatar ignored)' };
        throw new Error(`Retry failed: ${retryError.message}`);
      }
      
      throw new Error(`프로필 업데이트 실패: ${error.message}`);
    }

    return { success: true };
  }
};

// --- [Self-Test Block Removed for Production] ---

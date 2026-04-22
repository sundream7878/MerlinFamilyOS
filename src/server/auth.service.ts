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

    // 유저 정보 조회 (닉네임/이미지 실데이터 포함)
    const { data: profile } = await supabase
      .from('family_users')
      .select('nickname, avatar_url')
      .eq('email', email)
      .single();

    return {
      token,
      familyUid,
      email,
      nickname: profile?.nickname || email.split('@')[0],
      avatar_url: profile?.avatar_url
    };
  },

  // 2-2. 프로필 단건 조회
  getProfileByEmail: async (email: string) => {
    if (!supabase) return null;
    const { data } = await supabase
      .from('family_users')
      .select('nickname, avatar_url')
      .eq('email', email)
      .single();
    return data;
  },

  // 3. 토큰 검증
  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
      return null;
    }
  },

  // 4. 프로필 정보 업데이트 (윈드서퍼 요청에 따라 UPSERT 방식으로 전환)
  updateProfile: async (email: string, data: { nickname?: string; avatar_url?: string }) => {
    if (!supabase) throw new Error('DB 연결이 설정되지 않았습니다.');
    
    console.log(`[Auth] UPSERT profile for ${email}:`, data);

    // 1. 먼저 해당 유저의 존재 여부와 ID 확인
    const { data: user } = await supabase
      .from('family_users')
      .select('id')
      .eq('email', email)
      .single();

    const updateData: any = { 
      email,
      nickname: data.nickname,
      updated_at: new Date().toISOString()
    };
    
    // avatar_url 또는 profile_image 처리 (호환성 유지)
    if (data.avatar_url) updateData.avatar_url = data.avatar_url;

    // 2. UPSERT 실행 (없으면 만들고 있으면 수정)
    const { data: resultData, error } = await supabase
      .from('family_users')
      .upsert(updateData, { onConflict: 'email' })
      .select();

    if (error) {
      console.error('[Auth] UPSERT failed:', error.message);
      throw new Error(`프로필 저장 실패: ${error.message}`);
    }

    console.log('[Auth] UPSERT success:', resultData);
    return { success: true, message: '프로필이 안전하게 저장(UPSERT)되었습니다.' };
  }
};

// --- [Self-Test Block Removed for Production] ---

import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabaseServer';
import { MailService } from './mail.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const AuthService = {
  /**
   * JWT 토큰 발급 (내부 유틸)
   */
  issueToken(user: any) {
    return jwt.sign(
      { uid: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  /**
   * OTP 발송 및 DB 저장
   */
  async requestOTP(email: string) {
    // 6자리 난수 생성
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5분 유효

    // 1. 기존 사용되지 않은 OTP 무효화
    await supabaseAdmin
      .from('family_otp')
      .update({ is_used: true })
      .eq('email', email)
      .eq('is_used', false);

    // 2. 새 OTP 저장
    const { error: dbError } = await supabaseAdmin
      .from('family_otp')
      .insert({
        email,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
      });

    if (dbError) throw new Error(`DB Error: ${dbError.message}`);

    // 3. 메일 발송 (Resend 활용)
    const { error: mailError } = await MailService.sendOTP(email, otp);
    if (mailError) throw new Error(`Mail Error: ${mailError.message}`);

    return { success: true };
  },

  /**
   * OTP 검증 및 유저 생성/확인 -> JWT 반환
   */
  async verifyOTP(email: string, otp: string) {
    // 1. DB에서 유효한 OTP 조회
    const { data, error } = await supabaseAdmin
      .from('family_otp')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      throw new Error('Invalid or expired OTP');
    }

    // 2. OTP 사용 처리
    await supabaseAdmin
      .from('family_otp')
      .update({ is_used: true })
      .eq('id', data.id);

    // 3. 사용자 존재 확인 또는 생성
    let { data: user, error: userError } = await supabaseAdmin
      .from('family_users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('family_users')
        .insert({ email, nickname: email.split('@')[0] })
        .select()
        .single();
      
      if (createError) throw new Error(createError.message);
      user = newUser;

      // 초기 지갑 보상
      await supabaseAdmin.rpc('process_wallet_transaction', {
        p_user_id: user.id,
        p_app_id: '00000000-0000-0000-0000-000000000000',
        p_amount: 3000,
        p_type: 'welcome',
        p_request_id: `welcome_${user.id}`,
        p_display_text: '패밀리 합류를 환영합니다!'
      });
    }

    // 4. 세션 토큰 생성
    const token = this.issueToken(user);
    return { user, token };
  },

  /**
   * 보안 워프를 위한 30초 유효 코드 발급
   */
  async issueTransferCode(userId: string) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const { data, error } = await supabaseAdmin
      .from('family_transfer_codes')
      .insert({
        user_id: userId,
        transfer_code: code,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { transfer_code: code, expires_at: data.expires_at };
  },

  /**
   * 타 앱에서 워프 코드 검증 및 JWT 반환
   */
  async verifyTransferCode(code: string) {
    const { data, error } = await supabaseAdmin.rpc('verify_warp_code', {
      p_code: code
    });

    if (error || data.status !== 'success') {
      throw new Error(data?.message || 'Invalid transfer code');
    }

    const { data: user } = await supabaseAdmin
      .from('family_users')
      .select('*')
      .eq('id', data.user_id)
      .single();

    // 새 세션 토큰 발급
    const token = this.issueToken(user);
    return { user, token };
  }
};

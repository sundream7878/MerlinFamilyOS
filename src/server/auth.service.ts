import 'dotenv/config';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'merlin-hub-secret-2026';

// 임시 OTP 저장소 (실제 운영 시 Redis 추천)
const otpStore = new Map<string, { code: string; expires: number }>();

export const AuthService = {
  // 1. OTP 요청 및 발송
  requestOTP: async (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5분 유효

    otpStore.set(email, { code, expires });

    try {
      const { data, error } = await resend.emails.send({
        from: 'Merlin Hub <onboarding@resend.dev>', // 도메인 인증 전에는 resend 지정 주소 사용
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
        console.error('--- [RESEND API FAILURE] ---');
        console.error('Error Code:', error.name);
        console.error('Error Message:', error.message);
        console.error('Full Error Object:', JSON.stringify(error, null, 2));
        throw new Error(`이메일 발송 실패: ${error.message}`);
      }
      
      console.log('--- [RESEND API SUCCESS] ---');
      console.log('Message ID:', data?.id);
      return { success: true, message: '인증 코드가 발송되었습니다.' };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 2. OTP 검증 및 JWT 발급
  verifyOTP: async (email: string, code: string) => {
    const stored = otpStore.get(email);

    if (!stored || stored.code !== code || Date.now() > stored.expires) {
      throw new Error('인증 코드가 올바르지 않거나 만료되었습니다.');
    }

    // 검증 성공 후 삭제
    otpStore.delete(email);

    // JWT 발행
    const familyUid = `mfn-${Math.random().toString(36).substr(2, 9)}`; // 임시 UID 생성
    const token = jwt.sign(
      { email, familyUid, iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      familyUid,
      email,
      nickname: email.split('@')[0] // 임시 닉네임
    };
  }
};

// --- [Self-Test Block] ---
// 명령행에서 'npx tsx src/server/auth.service.ts'로 실행 시 테스트 발송 수행
if (import.meta.url === `file://${process.argv[1]}`) {
  const testEmail = process.env.TEST_EMAIL || 'chiu3@naver.com'; // 👈 공장장님 전용 테스트 계정
  console.log(`[Test] Sending OTP to ${testEmail}...`);
  AuthService.requestOTP(testEmail)
    .then(res => console.log('Test Result:', res))
    .catch(err => console.error('Test Failed:', err));
}

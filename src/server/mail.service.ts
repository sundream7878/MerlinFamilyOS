import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.MAIL_FROM || 'Merlin Family <onboarding@resend.dev>';

export const MailService = {
  /**
   * OTP 이메일 발송
   */
  async sendOTP(email: string, otp: string) {
    const html = `
      <div style="font-family: 'Pretendard', sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px; border: 1px solid #eee; border-radius: 16px; text-align: center;">
        <h1 style="color: #6366f1; margin-bottom: 24px;">Merlin Family</h1>
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">안녕하세요!<br/>패밀리 서비스 로그인을 위한 인증 코드입니다.</p>
        <div style="margin: 32px 0; padding: 20px; background-color: #f9fafb; border-radius: 12px;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1f2937;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #9ca3af;">회원가입/로그인 완료 후 3,000 크레딧을 확인하세요!</p>
        <hr style="margin: 32px 0; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #d1d5db;">본 메일은 Merlin Family OS 허브에서 발송되었습니다.</p>
      </div>
    `;

    return resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `[Merlin Family] 인증 코드: ${otp}`,
      html,
    });
  },

  /**
   * 공용 메일 릴레이 (타 앱에서 요청 시)
   */
  async sendRelayMail(to: string, subject: string, content: string, appName: string) {
    const html = `
      <div style="font-family: 'Pretendard', sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #6366f1;">Merlin Family: ${appName}</h2>
        <div style="margin: 20px 0; color: #374151; line-height: 1.5;">
          ${content}
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
          이 메일은 ${appName}의 요청으로 Merlin Family Hub를 통해 발송되었습니다.
        </p>
      </div>
    `;

    return resend.emails.send({
      from: fromEmail,
      to,
      subject: `[${appName}] ${subject}`,
      html,
    });
  }
};

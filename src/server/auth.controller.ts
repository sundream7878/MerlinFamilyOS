import { Request, Response, Router } from 'express';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { validateAppAccess } from './app.middleware';

const router = Router();

/**
 * [POST] /api/auth/otp/request
 * OTP 발송 요청
 */
router.post('/otp/request', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    await AuthService.requestOTP(email);
    res.json({ message: 'OTP sent successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * [POST] /api/auth/otp/verify
 * OTP 검증 및 로그인
 */
router.post('/otp/verify', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const result = await AuthService.verifyOTP(email, otp);
    res.json({ 
      message: 'Login successful', 
      user: result.user,
      token: result.token 
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

/**
 * [POST] /api/auth/transfer-code/issue
 * 워프 시작 (현 앱에서 코드 발급)
 */
router.post('/transfer-code/issue', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const result = await AuthService.issueTransferCode(userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * [POST] /api/auth/transfer-code/verify
 * 워프 도착 (새 앱에서 코드 검증 및 로그인)
 */
router.post('/transfer-code/verify', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required' });

    const result = await AuthService.verifyTransferCode(code);
    res.json({ 
      message: 'Transfer successful', 
      user: result.user,
      token: result.token
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

/**
 * [POST] /api/mail/relay
 * 타 패밀리 앱을 위한 메일 발송 대행
 * (허브의 Client ID/Secret 인증 필요)
 */
router.post('/mail/relay', validateAppAccess, async (req: Request, res: Response) => {
  try {
    const { to, subject, content, appName } = req.body;
    // validateAppAccess가 이미 client_id 검증 완료
    
    const { MailService } = require('./mail.service');
    await MailService.sendRelayMail(to, subject, content, appName);
    res.json({ message: 'Mail relayed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

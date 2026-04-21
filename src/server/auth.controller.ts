import { Router } from 'express';
import { AuthService } from './auth.service';

const router = Router();

// 1. OTP 요청
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: '이메일이 필요합니다.' });

  try {
    const result = await AuthService.requestOTP(email);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. OTP 검증
router.post('/verify-otp', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ success: false, message: '이메일과 코드가 필요합니다.' });

  try {
    const result = await AuthService.verifyOTP(email, code);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// 3. 현재 세션 정보 (Me)
router.get('/me', async (req, res) => {
  // 실제 운영 환경에서는 JWT 미들웨어 통과 후 req.user 반환
  // 임시로 헤더의 Bearer 토큰 존재 여부만 체크
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: '인증이 필요합니다.' });

  res.json({
    success: true,
    user: { email: 'admin@merlin.family', familyUid: 'mfn-admin-001' }
  });
});

export default router;

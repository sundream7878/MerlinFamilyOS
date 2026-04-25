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
  const { email, code, appId } = req.body;
  if (!email || !code) return res.status(400).json({ success: false, message: '이메일과 코드가 필요합니다.' });

  try {
    const result = await AuthService.verifyOTP(email, code, appId);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// 3. 현재 세션 정보 (Me)
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: '인증이 필요합니다.' });

  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token);
  if (!decoded) return res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });

  try {
    // DB에서 최신 프로필 정보 가져오기 (성능을 위해 AuthService에 위임 권장하나 우선 직접 구현)
    const profile = await AuthService.getProfileByEmail(decoded.email);
    res.json({
      success: true,
      user: { 
        email: decoded.email, 
        userId: decoded.userId,
        nickname: profile?.nickname,
        avatar_url: profile?.avatar_url
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. 프로필 정보 업데이트 (닉네임, 이미지 등)
router.put('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: '인증이 필요합니다.' });

  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token);
  if (!decoded) return res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });

  const { nickname, avatar_url, profile_image } = req.body;
  const finalAvatar = avatar_url || profile_image;
  
  try {
    const result = await AuthService.updateProfile(decoded.email, { nickname, avatar_url: finalAvatar });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

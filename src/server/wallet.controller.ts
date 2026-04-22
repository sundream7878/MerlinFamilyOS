import { Router } from 'express';
import { WalletService } from './wallet.service';

const router = Router();

import { AuthService } from './auth.service';

// 1. 잔액 조회
router.get('/balance', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: '인증이 필요합니다.' });

  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token);
  if (!decoded) return res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });

  try {
    const balance = await WalletService.getBalance(decoded.familyUid);
    res.json({ success: true, balance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. 통합 트랜잭션 처리 (충전/차감/사용)
router.post('/transaction', async (req, res) => {
  const { familyUid, amount, request_id, transaction_type, display_text, app_id } = req.body;
  const appSecret = req.headers['x-app-secret'];

  // [Security] 서버-투-서버 인증 (어그로필터 등 앱에서 호출 시)
  // 실제 운영 시에는 DB의 apps 테이블에서 app_id에 맞는 secret을 조회해야 함
  const VALID_APP_SECRET = process.env.HUB_APP_SECRET || 'merlin-family-secret-key-2026';
  
  if (!appSecret || appSecret !== VALID_APP_SECRET) {
    return res.status(403).json({ success: false, message: 'App 인증에 실패했습니다.' });
  }

  if (!familyUid || amount === undefined || !request_id) {
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }

  try {
    const result = await WalletService.processTransaction(familyUid, {
      amount,
      app_id: app_id || 'UNKNOWN',
      request_id,
      transaction_type: transaction_type || 'SPEND',
      display_text: display_text || 'Family App Transaction'
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

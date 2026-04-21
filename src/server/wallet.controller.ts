import { Router } from 'express';
import { WalletService } from './wallet.service';

const router = Router();

// 1. 잔액 조회
router.get('/balance', async (req, res) => {
  // 실제 운영 환경에서는 JWT 토큰에서 familyUid 추출
  const familyUid = req.query.familyUid as string || 'mfn-admin-001';
  
  try {
    const balance = await WalletService.getBalance(familyUid);
    res.json({ balance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. 크레딧 사용
router.post('/use', async (req, res) => {
  const { amount, request_id, display_text } = req.body;
  const familyUid = 'mfn-admin-001'; // 임시 하드코딩

  if (!amount || !request_id) {
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }

  try {
    const result = await WalletService.useCredit(familyUid, { amount, request_id, display_text });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;

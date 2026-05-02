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
    const balance = await WalletService.getBalance(decoded.userId);
    res.json({ success: true, balance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. 통합 트랜잭션 처리 (충전/차감/사용)
router.post('/transaction', async (req, res) => {
  const { userId, amount, request_id, transaction_type, display_text, app_id } = req.body;
  const appSecret = req.headers['x-app-secret'];

  // [Security] 서버-투-서버 인증 (어그로필터 등 앱에서 호출 시)
  // 실제 운영 시에는 DB의 apps 테이블에서 app_id에 맞는 secret을 조회해야 함
  const VALID_APP_SECRET = process.env.HUB_APP_SECRET || 'merlin-family-secret-key-2026';
  
  if (!appSecret || appSecret !== VALID_APP_SECRET) {
    return res.status(403).json({ success: false, message: 'App 인증에 실패했습니다.' });
  }

  if (!userId || amount === undefined || !request_id) {
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }

  try {
    const result = await WalletService.processTransaction(userId, {
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

// 3. 과금 정책 조회 (Pricing Info)
router.get('/pricing', async (req, res) => {
  const { app_id, action_type, resource_id } = req.query;
  const appSecret = req.headers['x-app-secret'];

  const VALID_APP_SECRET = process.env.HUB_APP_SECRET || 'merlin-family-secret-key-2026';
  
  if (!appSecret || appSecret !== VALID_APP_SECRET) {
    return res.status(403).json({ success: false, message: 'App 인증에 실패했습니다.' });
  }

  if (!app_id || !action_type) {
    return res.status(400).json({ success: false, message: 'app_id 와 action_type 파라미터가 필요합니다.' });
  }

  try {
    const pricing = await WalletService.getPricing(app_id as string, action_type as string, resource_id as string);
    res.json({ success: true, data: pricing });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. 온보딩 미션 자동 보상 청구
router.post('/reward/onboarding', async (req, res) => {
  const { userId, app_id, request_id } = req.body;
  const appSecret = req.headers['x-app-secret'];

  const VALID_APP_SECRET = process.env.HUB_APP_SECRET || 'merlin-family-secret-key-2026';
  
  if (!appSecret || appSecret !== VALID_APP_SECRET) {
    return res.status(403).json({ success: false, message: 'App 인증에 실패했습니다.' });
  }

  if (!userId || !app_id || !request_id) {
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }

  try {
    const result = await WalletService.processTransaction(userId, {
      amount: 1000, // 온보딩 보상은 1,000C 고정 (강령)
      app_id: app_id,
      request_id: `REWARD-ONB-${request_id}`, // 중복 방지 접두사
      transaction_type: 'EARN_ONBOARDING',
      display_text: `${app_id} 최초 온보딩 미션 완료 보상`
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. 동적 과금 계산 및 청구 (신규 영상 분석 시)
router.post('/transaction/dynamic', async (req, res) => {
  const { userId, app_id, resource_id, raw_cost, request_id, display_text } = req.body;
  const appSecret = req.headers['x-app-secret'];

  const VALID_APP_SECRET = process.env.HUB_APP_SECRET || 'merlin-family-secret-key-2026';
  
  if (!appSecret || appSecret !== VALID_APP_SECRET) {
    return res.status(403).json({ success: false, message: 'App 인증에 실패했습니다.' });
  }

  if (!userId || !app_id || !resource_id || raw_cost === undefined || !request_id) {
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }

  try {
    const result = await WalletService.setDynamicPricingAndCharge(userId, {
      app_id,
      resource_id,
      raw_cost: Number(raw_cost),
      request_id,
      display_text: display_text || `${app_id} 동적 분석 과금`
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

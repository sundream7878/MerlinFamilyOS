import { Request, Response, Router } from 'express';
import { WalletService } from './wallet.service';
import { validateAppAccess } from './app.middleware';

const router = Router();

/**
 * [GET] /api/wallet/balance
 * 잔액 조회
 */
router.get('/balance', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const balance = await WalletService.getBalance(userId as string);
    res.json({ balance });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * [POST] /api/wallet/use
 * 크레딧 차감 (Idempotency 및 App 검증 필수)
 */
router.post('/use', validateAppAccess, async (req: Request, res: Response) => {
  try {
    const { userId, amount, requestId, displayText, type } = req.body;
    const appId = (req as any).appId;

    if (!userId || !amount || !requestId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // amount는 음수로 전달받아 차감 처리 (혹은 내부에서 음수화)
    const result = await WalletService.processTransaction({
      userId,
      appId,
      amount: -Math.abs(amount), // 강제 음수화 (차감)
      type: type || 'usage',
      requestId,
      displayText: displayText || '서비스 이용 크레딧 차감'
    });

    res.json(result);
  } catch (err: any) {
    res.status(402).json({ error: err.message }); // 402 Payment Required for insufficient funds
  }
});

/**
 * [POST] /api/wallet/reward
 * 크레딧 지급 (보상용)
 */
router.post('/reward', validateAppAccess, async (req: Request, res: Response) => {
  try {
    const { userId, amount, requestId, displayText, type } = req.body;
    const appId = (req as any).appId;

    const result = await WalletService.processTransaction({
      userId,
      appId,
      amount: Math.abs(amount), // 강제 양수화 (지급)
      type: type || 'reward',
      requestId,
      displayText: displayText || '패밀리 보상 지급'
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * [POST] /api/wallet/recharge
 * 외부 결제(KCP 등) 성공 후 크레딧 충전
 * (허브의 Client ID/Secret 인증 필수)
 */
router.post('/recharge', validateAppAccess, async (req: Request, res: Response) => {
  try {
    const { userId, amount, requestId, displayText } = req.body;
    const appId = (req as any).appId;

    const result = await WalletService.processTransaction({
      userId,
      appId,
      amount: Math.abs(amount),
      type: 'recharge',
      requestId,
      displayText: displayText || '크레딧 충전 (KCP 결제 완료)'
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

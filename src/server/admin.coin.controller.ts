import { Router } from 'express';
import { WalletService } from './wallet.service';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * [ADMIN] 전체 코인 히스토리 조회 (Master Ledger)
 * GET /api/admin/coin-history
 */
router.get('/coin-history', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, message: 'DB 연결 실패' });

  try {
    const { user_id, app_id, type } = req.query;

    let query = supabase
      .from('family_wallet_transactions')
      .select(`
        *,
        user:family_users(email, nickname)
      `)
      .order('created_at', { ascending: false });

    if (user_id) query = query.eq('user_id', user_id);
    if (app_id) query = query.eq('app_id', app_id);
    if (type) query = query.eq('transaction_type', type);

    const { data, error } = await query.limit(100);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * [ADMIN] 코인 수동 조정 (Manual Adjustment)
 * POST /api/admin/coin-adjust
 */
router.post('/coin-adjust', async (req, res) => {
  const { userId, amount, reason } = req.body;

  if (!userId || amount === undefined || !reason) {
    return res.status(400).json({ success: false, message: '필수 데이터 누락 (userId, amount, reason)' });
  }

  try {
    const requestId = `ADJUST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    const result = await WalletService.processTransaction(userId, {
      amount,
      app_id: 'HUB_ADMIN',
      request_id: requestId,
      transaction_type: amount >= 0 ? 'ADMIN_REWARD' : 'ADMIN_REVOKE',
      display_text: `[관리자 조정] ${reason}`
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * [ADMIN] 유저 정보 및 잔액 조회
 * GET /api/admin/user-balance/:userId
 */
router.get('/user-balance/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!supabase) return res.status(500).json({ success: false, message: 'DB 연결 실패' });

  try {
    const { data: user } = await supabase
      .from('family_users')
      .select('email, nickname')
      .eq('id', userId)
      .single();

    const balance = await WalletService.getBalance(userId);

    res.json({ success: true, user, balance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

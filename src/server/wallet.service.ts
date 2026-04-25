import { createClient } from '@supabase/supabase-js';

// Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export const WalletService = {
  /**
   * 유저의 현재 잔액 조회 (UUID 직접 사용)
   */
  getBalance: async (userId: string) => {
    if (!supabase) return 0;

    const { data: balanceData } = await supabase
      .from('family_wallet_balances')
      .select('balance')
      .eq('user_id', userId)
      .single();

    return balanceData?.balance || 0;
  },

  /**
   * 코인 사용/충전 처리 (멱등성 보장, UUID 기반)
   */
  processTransaction: async (userId: string, payload: { 
    amount: number; 
    app_id: string;
    request_id: string; 
    transaction_type: string;
    display_text: string;
  }) => {
    if (!supabase) throw new Error('DB 연결이 없습니다.');

    const { amount, app_id, request_id, transaction_type, display_text } = payload;

    // 1. 멱등성 체크: 이미 처리된 트랜잭션인지 확인
    const { data: existingTx } = await supabase
      .from('family_wallet_transactions')
      .select('id')
      .eq('request_id', request_id)
      .single();

    if (existingTx) {
      const balance = await WalletService.getBalance(userId);
      return { success: true, balance, status: 'ALREADY_PROCESSED' };
    }

    // 2. 트랜잭션 기록
    await supabase.from('family_wallet_transactions').insert({
      user_id: userId,
      app_id,
      amount,
      request_id,
      transaction_type,
      display_text
    });

    // 3. 잔액 업데이트 (Upsert)
    const currentBalance = await WalletService.getBalance(userId);
    const newBalance = currentBalance + amount;

    await supabase.from('family_wallet_balances').upsert({
      user_id: userId,
      balance: newBalance,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    console.log(`[Wallet] Transaction ${transaction_type}: ${amount}C (UUID: ${userId})`);

    return {
      success: true,
      balance: newBalance,
      status: 'SUCCESS'
    };
  }
};

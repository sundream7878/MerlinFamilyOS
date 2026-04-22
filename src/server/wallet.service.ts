import { createClient } from '@supabase/supabase-js';

// Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export const WalletService = {
  /**
   * 유저의 현재 잔액 조회 (family_wallet_balances 테이블 기반)
   */
  getBalance: async (familyUid: string) => {
    if (!supabase) return 0;

    // 1. 유저 UUID 먼저 조회
    const { data: user } = await supabase
      .from('family_users')
      .select('id')
      .eq('family_uid', familyUid)
      .single();

    if (!user) return 0;

    // 2. 잔액 테이블 조회
    const { data: balanceData } = await supabase
      .from('family_wallet_balances')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    // 잔액 정보가 없으면 가입 환영 차원에서 0으로 시작 (또는 초기화 로직 수행)
    return balanceData?.balance || 0;
  },

  /**
   * 크레딧 사용/충전 처리 (멱등성 보장 및 원장 동시 업데이트)
   */
  processTransaction: async (familyUid: string, payload: { 
    amount: number; 
    app_id: string;
    request_id: string; 
    transaction_type: string;
    display_text: string;
  }) => {
    if (!supabase) throw new Error('DB 연결이 없습니다.');

    const { amount, app_id, request_id, transaction_type, display_text } = payload;

    // 1. 유저 UUID 조회
    const { data: user } = await supabase
      .from('family_users')
      .select('id')
      .eq('family_uid', familyUid)
      .single();

    if (!user) throw new Error('사용자를 찾을 수 없습니다.');

    // 2. 멱등성 체크: 이미 처리된 트랜잭션인지 확인
    const { data: existingTx } = await supabase
      .from('family_wallet_transactions')
      .select('id')
      .eq('request_id', request_id)
      .single();

    if (existingTx) {
      const balance = await WalletService.getBalance(familyUid);
      return { success: true, balance, status: 'ALREADY_PROCESSED' };
    }

    // 3. 트랜잭션 기록 및 잔액 업데이트 (실제 운영 시 RPC나 Transaction 사용 권장)
    // 기록 저장
    await supabase.from('family_wallet_transactions').insert({
      user_id: user.id,
      app_id,
      amount,
      request_id,
      transaction_type,
      display_text
    });

    // 잔액 업데이트 (Upsert)
    const currentBalance = await WalletService.getBalance(familyUid);
    const newBalance = currentBalance + amount;

    await supabase.from('family_wallet_balances').upsert({
      user_id: user.id,
      balance: newBalance,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    console.log(`[Wallet] Transaction ${transaction_type}: ${amount}C (UID: ${familyUid})`);

    return {
      success: true,
      balance: newBalance,
      status: 'SUCCESS'
    };
  }
};

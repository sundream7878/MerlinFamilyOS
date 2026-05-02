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
   * 과금 단가표 조회 (Pricing Info)
   */
  getPricing: async (appId: string, actionType: string, resourceId?: string) => {
    if (!supabase) return { status: 'NOT_FOUND', price: 0, currency: 'C' };

    // AGGRO_FILTER: 캐싱된 고정 단가 조회
    if (appId === 'AGGRO_FILTER' && resourceId) {
      const { data } = await supabase
        .from('family_aggro_video_pricing')
        .select('fixed_coin_price')
        .eq('video_id', resourceId)
        .single();
        
      if (data) {
        return { status: 'CACHED', price: data.fixed_coin_price, currency: 'C', description: '기존 분석된 영상 고정가 (순수익)' };
      } else {
        // [레거시 방어 로직] 허브 DB에 단가가 없어도 어그로필터 로컬 DB에는 존재하는 400여 개의 기존 영상일 수 있음.
        // 이 경우 어그로필터는 재분석을 하지 않으므로 30C를 반환하여 기존처럼 과금할 수 있도록 폴백 처리.
        // 완전 신규 영상인 경우 어그로필터가 이를 무시하고 동적 과금 라인(/transaction/dynamic)을 태움.
        return { status: 'NOT_FOUND', price: 30, currency: 'C', description: '신규 분석 대상 또는 레거시 영상 기본가' };
      }
    }

    return { status: 'DEFAULT', price: 10, currency: 'C', description: '기본 API 호출 요금' };
  },

  /**
   * 동적 과금 계산 및 청구 (신규 분석 시)
   */
  setDynamicPricingAndCharge: async (userId: string, payload: {
    app_id: string;
    resource_id: string;
    raw_cost: number;
    request_id: string;
    display_text: string;
  }) => {
    if (!supabase) throw new Error('DB 연결이 없습니다.');

    // 1. 마진 계산 (공장장님 지시: 어그로필터는 3배)
    const marginMultiplier = payload.app_id === 'AGGRO_FILTER' ? 3 : 1; 
    const fixedCoinPrice = Math.ceil(payload.raw_cost * marginMultiplier);

    // 2. 단가표 영구 박제 (가장 먼저 캐싱)
    if (payload.app_id === 'AGGRO_FILTER') {
      await supabase.from('family_aggro_video_pricing').upsert({
        video_id: payload.resource_id,
        raw_token_cost: payload.raw_cost,
        margin_multiplier: marginMultiplier,
        fixed_coin_price: fixedCoinPrice,
        created_at: new Date().toISOString()
      }, { onConflict: 'video_id' });
    }

    // 3. 유저 잔액 차감 (processTransaction 재사용하여 장부 기록)
    return await WalletService.processTransaction(userId, {
      amount: -fixedCoinPrice,
      app_id: payload.app_id,
      request_id: payload.request_id,
      transaction_type: 'USE_DYNAMIC_ANALYSIS',
      display_text: payload.display_text
    });
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

import { supabaseAdmin } from '../lib/supabaseServer';

export const WalletService = {
  /**
   * 잔액 조회
   */
  async getBalance(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('family_wallet_balances')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows'
      throw new Error(`Balance fetch error: ${error.message}`);
    }

    return data?.balance || 0;
  },

  /**
   * 크레딧 차감/지급 (Atomic RPC 호출)
   */
  async processTransaction(params: {
    userId: string,
    appId: string,
    amount: number,
    type: string,
    requestId: string,
    displayText: string
  }) {
    const { data, error } = await supabaseAdmin.rpc('process_wallet_transaction', {
      p_user_id: params.userId,
      p_app_id: params.appId,
      p_amount: params.amount,
      p_type: params.type,
      p_request_id: params.requestId,
      p_display_text: params.displayText
    });

    if (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }

    // RPC 반환값 처리 (json object)
    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return data;
  }
};

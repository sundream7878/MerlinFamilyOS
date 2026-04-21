// 임시 지갑 저장소 (실제 운영 시 Supabase DB 연동)
const walletStore = new Map<string, number>();
const transactionStore = new Set<string>(); // request_id 필터 (멱등성)

export const WalletService = {
  // 1. 잔액 조회
  getBalance: async (familyUid: string) => {
    // 신규 유저라면 환영 크레딧 3,000C 지급
    if (!walletStore.has(familyUid)) {
      walletStore.set(familyUid, 3000);
    }
    return walletStore.get(familyUid) || 0;
  },

  // 2. 크레딧 사용 (차감)
  useCredit: async (familyUid: string, payload: { amount: number; request_id: string; display_text: string }) => {
    const { amount, request_id, display_text } = payload;

    // 멱등성 체크: 이미 처리된 요청인지 확인 (중복 결제 방지)
    if (transactionStore.has(request_id)) {
      const balance = walletStore.get(familyUid) || 0;
      return { success: true, balance, status: 'ALREADY_PROCESSED' };
    }

    const currentBalance = await WalletService.getBalance(familyUid);

    if (currentBalance < amount) {
      throw new Error('잔액이 부족합니다.');
    }

    // 차감
    const newBalance = currentBalance - amount;
    walletStore.set(familyUid, newBalance);
    
    // 거래 기록 (실제 운영 시 DB 전표 처리)
    transactionStore.add(request_id);
    console.log(`[Wallet] Transaction: -${amount}C for "${display_text}" (ID: ${request_id})`);

    return {
      success: true,
      balance: newBalance,
      status: 'SUCCESS'
    };
  }
};

/**
 * [Aggro Filter] Merlin Family Hub 연동 모듈
 * 출시 전 개별 인증/지갑 로직을 허브로 전환하기 위한 핵심 코드입니다.
 */

const HUB_BASE_URL = 'http://localhost:3001'; // 허브 코어 주소
const CLIENT_ID = 'aggro-filter-app'; // seed.sql에 등록된 ID
const CLIENT_SECRET = 'aggro-secret-123'; // 발급받은 Secret

export const AggroHubClient = {
  /**
   * 1. 인증 모듈 교체 (OTP 검증 후 Hub UID/JWT 획득)
   */
  async verifyAuth(email: string, otp: string) {
    const response = await fetch(`${HUB_BASE_URL}/api/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    // 결과: { user: { id: family_uid, ... }, token: "JWT" }
    return result;
  },

  /**
   * 2. 지갑/결제 구조 조정 (KCP 결제 성공 후 허브 충전 호출)
   * @param userId family_uid
   * @param amount 충전 금액
   * @param requestId KCP 거래 번호 등 고유 ID (Idempotency)
   */
  async rechargeCredit(userId: string, amount: number, requestId: string) {
    const response = await fetch(`${HUB_BASE_URL}/api/wallet/recharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CLIENT_ID,
        'x-client-secret': CLIENT_SECRET,
      },
      body: JSON.stringify({
        userId,
        amount,
        requestId,
        displayText: '어그로필터 크레딧 충전 (KCP)',
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    return result;
  },

  /**
   * 3. 보안 워프 준비 (타 앱 이동을 위한 코드 발급)
   */
  async getWarpCode(userId: string) {
    const response = await fetch(`${HUB_BASE_URL}/api/auth/transfer-code/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    // 결과: { transfer_code: "ABC12345", expires_at: "..." }
    return result;
  }
};

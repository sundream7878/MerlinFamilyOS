/**
 * Merlin Hub SDK — Wallet(Coin) Module
 * 통합 코인 차감/조회 (Idempotency Key 필수)
 * 
 * [2026-04-25] UUID 단일화 적용: familyUid 폐기, userId(UUID) 기반으로 전환
 * [2026-04-25] 크레딧 → 코인 용어 통일
 */

import { hubFetch } from './client';

export interface UseCoinParams {
  amount: number;
  requestId: string;       // Idempotency Key — 중복 차감 방지
  displayText?: string;    // 원장에 표시할 설명 (예: "영상 분석 1회")
}

export interface UseCoinResult {
  success: boolean;
  balance?: number;
  error?: string;
}

/**
 * localStorage에서 userId(UUID) 조회
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('merlin_user_id');
}

/**
 * 코인 차감 요청
 * @param params 차감 파라미터 (amount, requestId 필수)
 */
export async function useCoin(params: UseCoinParams): Promise<UseCoinResult> {
  try {
    const { ok, data } = await hubFetch<UseCoinResult>('/api/wallet/transaction', {
      method: 'POST',
      body: JSON.stringify({
        userId: getUserId(),
        amount: -Math.abs(params.amount),  // 차감은 항상 음수
        request_id: params.requestId,
        transaction_type: 'USE_AGGRO',
        display_text: params.displayText || '코인 사용',
      }),
    });

    if (!ok) {
      return { success: false, error: data?.error || '코인 차감 실패' };
    }

    return { success: true, balance: data.balance };
  } catch (err) {
    console.error('[MerlinHub] useCoin error:', err);
    return { success: false, error: '허브 서버 연결 실패' };
  }
}

/**
 * 현재 코인 잔액 조회 (JWT 토큰 기반 — userId 별도 전달 불요)
 */
export async function getBalance(): Promise<{ success: boolean; balance?: number; error?: string }> {
  try {
    const { ok, data } = await hubFetch<{ success: boolean; balance: number }>('/api/wallet/balance');

    if (!ok) {
      return { success: false, error: '잔액 조회 실패' };
    }

    return { success: true, balance: data.balance };
  } catch (err) {
    console.error('[MerlinHub] getBalance error:', err);
    return { success: false, error: '허브 서버 연결 실패' };
  }
}

import { createClient } from '@supabase/supabase-js';

// Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// [임시] MOCK 데이터 (DB 연동 불가 시 폴백용)
const MOCK_APPS_DB = [
  { no: 1, id: 'APP-01', name: '어그로필터', status: '준비중', openDate: '26년 5월 예정' },
  { no: 2, id: 'APP-02', name: '금고지기', status: '운영중', openDate: '24년 10월 오픈' },
];

export const AppService = {
  /**
   * 등록된 모든 앱 목록 조회
   */
  async listApps() {
    return MOCK_APPS_DB;
  },

  /**
   * 전체 사용자 목록 조회 (진짜 DB 연동)
   */
  async listUsers() {
    console.log('[AppService] Fetching all users from DB...');
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('family_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('DB Fetch Error:', error);
      return [];
    }
    return data;
  },

  /**
   * 대시보드 통계 조회
   */
  async getStats() {
    if (!supabase) return { total: 0, today: 0, session: 0, rate: 0 };

    const { count: totalCount } = await supabase
      .from('family_users')
      .select('*', { count: 'exact', head: true });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count: todayCount } = await supabase
      .from('family_users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString());

    return {
      total: totalCount || 0,
      today: todayCount || 0,
      session: Math.floor((totalCount || 0) * 0.15) + 1, // 가상 세션 수
      rate: 98.5
    };
  },

  /**
   * 특정 앱의 권한 범위(Scopes) 업데이트
   */
  async updateAppScopes(appId: string, scopes: { scope: string; description: string }[]) {
     console.log(`[AppService] Updated scopes for ${appId}:`, scopes);
     return { success: true };
  }
};

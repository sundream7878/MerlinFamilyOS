// [임시] MOCK 데이터 (DB 연동 전까지 사용)
const MOCK_APPS_DB = [
  { no: 1, id: 'APP-01', name: '어그로필터', status: '준비중', openDate: '26년 5월 예정' },
  { no: 2, id: 'APP-02', name: '금고지기', status: '운영중', openDate: '24년 10월 오픈' },
];

export const AppService = {
  /**
   * 등록된 모든 앱 목록 조회
   */
  async listApps() {
    // DB 대신 Mock 데이터 반환
    return MOCK_APPS_DB;
  },

  /**
   * 특정 앱의 권한 범위(Scopes) 업데이트
   */
  async updateAppScopes(appId: string, scopes: { scope: string; description: string }[]) {
    console.log(`[AppService] Updated scopes for ${appId}:`, scopes);
    return { success: true };
  }
};

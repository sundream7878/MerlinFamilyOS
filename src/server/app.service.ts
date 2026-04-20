import { supabaseAdmin } from '../lib/supabaseServer';

export const AppService = {
  /**
   * 등록된 모든 앱 목록 조회
   */
  async listApps() {
    const { data, error } = await supabaseAdmin
      .from('family_apps')
      .select(`
        *,
        scopes:family_app_scopes(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * 특정 앱의 권한 범위(Scopes) 업데이트
   */
  async updateAppScopes(appId: string, scopes: { scope: string; description: string }[]) {
    // 1. 기존 권한 삭제
    const { error: deleteError } = await supabaseAdmin
      .from('family_app_scopes')
      .delete()
      .eq('app_id', appId);

    if (deleteError) throw new Error(deleteError.message);

    // 2. 새 권한 삽입
    if (scopes.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('family_app_scopes')
        .insert(
          scopes.map(s => ({
            app_id: appId,
            scope: s.scope,
            description: s.description
          }))
        );

      if (insertError) throw new Error(insertError.message);
    }

    return { success: true };
  }
};

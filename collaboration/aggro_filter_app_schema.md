# 📥 AggroFilter(App) 원시 DB 스키마 (v1.0)
- 확보일시: 2026-04-22
- 관리자: 안티그래비티

이 파일은 어그로필터 앱이 독립적으로 사용하던 모든 DB 구조를 기록한 로우(Raw) 데이터입니다. 허브 스키마와의 합치(Alignment) 작업 시 참조용으로 사용합니다.

## [주요 테이블 그룹]
1. **Core Stats**: `t_users`, `t_analyses`, `t_channels`, `t_videos`
2. **Bot Systems**: `bot_aggro_keywords`, `bot_comment_logs`, `bot_community_targets`
3. **App Logic**: `t_prediction_quiz`, `t_channel_subscriptions`, `t_rankings_cache`
4. **Legacy Auth**: `t_verification_codes`, `t_magic_links`, `t_cafe24_tokens`

---

## 📋 테이블 상세 명세 (전체 33개 테이블)

### t_users (기존 로컬 유저)
- `f_id`: Primary Key (연동 후 허브 UID로 대체 대상)
- `f_credits`: 로컬 잔액 (허브 지갑으로 통합 대상)
- `total_predictions`, `avg_gap`, `current_tier`: **[유지] 어그로필터 고유 서비스 데이터**
> **[윈드서퍼 — 2026-04-23]** `f_id`에 Hub `family_uid`(mfn-xxx)도 저장됨. profile PUT을 UPSERT로 전환하여 Hub 유저 row 자동 생성. `f_nickname`/`f_image`는 향후 `app_aggro_profiles`로 이관 대상.

### t_analyses (영상 분석 데이터)
- 어그로필터의 핵심 실물 데이터. (허브 시스템과 분리 유지)

### t_credit_history / t_payment_logs
- 지불 관련 이력. (허브의 `family_wallet_transactions`와 대조 및 통합 대상)

*(이하 사용자 제공 리스트 전체를 정밀 보존함)*

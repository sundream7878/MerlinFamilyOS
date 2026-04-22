# 📜 Merlin Family OS - 마스터 통합 스키마 (v1.4 - App 통합형)
- 마지막 업데이트: 2026-04-22
- 관리자: 안티그래비티 (Hub) & 윈드서퍼 (App)

## [데이터 통합 전략]
1. **SSOT (Single Source of Truth)**: 유저 기본 신원과 지갑(Wallet)은 **허브**가 관리한다.
2. **Profile Extension**: 각 앱(어그로필터 등)은 허브 UID를 참조하는 **확장 테이블**을 통해 고유 기능을 유지한다.
3. **ID Migration**: 기존 앱의 로컬 ID(`f_id` 등)는 허브의 `id`(UUID)로 점진적 이관한다.

---

## 1. 사용자 통합 관리 (Modified)

### family_users (통합 마스터)
*허브와 앱이 공유하는 유저의 심장부*
- **id**: UUID (Global Primary Key)
- **family_uid**: TEXT (유저 노출용 고유 번호)
- **email**: TEXT (식별 이메일)
- **nickname**: TEXT (통합 닉네임)
- **avatar_url**: TEXT (프로필 이미지 데이터/경로)
- **admin_memo**: TEXT (허브 관리자용 비고)
- **created_at**: TIMESTAMPTZ
- **updated_at**: TIMESTAMPTZ (프로필 수정 시 갱신)

> **[MEMO] 프로필 이미지 정책 (2026-04-23)**
> - **방식**: 클라이언트(App) 측에서 **최대 가로세로 200px**로 리사이징 후 **Base64** 문자열로 변환하여 저장.
> - **사유**: 별도의 이미지 스토리지 구축 비용 및 관리 복잡도를 줄이면서도 DB 부하를 최소화하기 위한 최적의 절충안 (멀린 공장장님 아이디어).

### app_aggro_profiles (어그로필터 확장 프로필)
*어그로필터 앱만의 고유 데이터를 보관하는 전용 테이블*
- **user_id**: UUID (REFERENCES family_users.id)
- **total_predictions**: INTEGER (예측 참여 수)
- **avg_gap**: NUMERIC (평균 오차)
- **current_tier**: TEXT (현재 티어)
- **tier_emoji**: TEXT (티어 아이콘)
- **f_notify_settings**: JSONB (알림 설정)

---

## 2. 지갑 및 자산 통합 (Syncing)

### family_wallet_balances (통합 잔액)
- **user_id**: UUID (REFERENCES family_users.id)
- **balance**: BIGINT (모든 앱에서 공용으로 사용하는 총 잔액 C)
- **updated_at**: TIMESTAMPTZ

---

## 3. 기록 및 로그 (App Specific)

### t_analyses (영상 분석 데이터)
- **app_owned**: 이 데이터는 어그로필터 앱이 소유하며, `f_user_id` 칼럼을 통해 `family_users.id`를 참조한다.

---
## [윈드서퍼 미션 가이드]
윈드서퍼는 기존 `t_users` 테이블에 있는 데이터를 위 `app_aggro_profiles`로 이관하고, 모든 비즈니스 로직에서 허브의 `user_id`를 사용하도록 코드를 수정해야 함.

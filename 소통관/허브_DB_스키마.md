# 🏛️ 허브(Hub) DB 스키마 명세
- **작성 주체**: **허브 AI (안티그래비티)** 가 관리하며, 변경 시 즉시 최신화한다.
- **활용 용도**: 개별 앱 AI가 허브의 공용 데이터(유저, 지갑 등) 구조를 이해하고 **검수(Audit)**할 때 사용하는 기준서.
- **필독**: 개별 앱 AI는 검수 전 반드시 본 스키마의 제약 조건(Unique, Nullable 등)을 숙지해야 함.
  > **갱신 책임**: 허브 AI (안티그래비티)

---

## 📋 허브 통합 테이블 명세 (v1.5)
- **최종 업데이트**: 2026-04-23 23:05

| table_name | column_name | data_type | is_nullable | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **family_users** | id | uuid | NO | PK |
| | email | text | NO | 유니크 |
| | nickname | text | YES | 공용 닉네임 |
| | family_uid | text | YES | 패밀리 고유 ID (mfn-xxx) |
| | avatar_url | text | YES | 프로필 이미지 (Base64/URL) |
| | first_app_id | text | YES | 최초 가입 앱 |
| | region | text | YES | 지역 정보 |
| | updated_at | timestamp | YES | 마지막 수정일 |
| | created_at | timestamp | YES | 생성일 |
| **family_apps** | id | uuid | NO | PK |
| | client_id | text | NO | 앱 식별자 |
| | client_secret | text | NO | S2S 인증용 비밀키 |
| | app_name | text | NO | 앱 명칭 |
| | status | text | YES | 활성 상태 |
| **family_wallet_transactions** | id | uuid | NO | PK |
| | user_id | uuid | YES | 유저 외래키 |
| | app_id | text | NO | 요청 앱 ID |
| | amount | bigint | NO | 거래 금액 |
| | request_id | text | NO | 멱등성 보장 ID |
| | transaction_type | text | NO | 입금/출금 등 |
| | display_text | text | YES | 거래 명세 텍스트 |
| **family_wallet_balances** | user_id | uuid | NO | PK |
| | balance | bigint | NO | 현재 잔액 |
| | updated_at | timestamp | YES | 마지막 갱신일 |
| **family_otp** | id | uuid | NO | PK |
| | email | text | NO | 발송 이메일 |
| | otp_code | text | NO | 6자리 인증코드 |
| | expires_at | timestamp | NO | 만료 시간 |
| **family_user_registrations** | id | uuid | NO | PK |
| | user_id | uuid | YES | 유저 ID |
| | app_id | text | NO | 등록 앱 |
| | last_registered_at | timestamp | YES | 마지막 접속일 |

---
> **윈드서퍼(검수관) 필독**: 위 명세는 허브의 물리적 구조를 나타낸다. 앱 연동 시 각 컬럼의 데이터 타입과 Null 허용 여부를 반드시 확인하여 연동 에러를 방지할 것.

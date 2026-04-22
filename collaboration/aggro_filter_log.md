# 📜 Merlin Hub - AggroFilter 협업 일지 (v1.3 - ID/Wallet 실전 통합)

## [EMERGENCY_ROLLBACK]
- 장애 발생 시 `RESTORE_REQUEST: [해시]` 입력 후 공장장님께 보고할 것.

---

## 1. 운영 원칙: Master Schema v1.4 준수
- `collaboration\master_schema.md` 파일이 허브와 앱 간의 유일한 데이터 표준이다.
- 모든 앱은 자체적인 유저 마스터 테이블을 가지지 않는다.

---

## 2. [미션 #2] 앱 로컬 유저 시스템 폐기 및 허브 표준 통합

### **[안티의 리팩토링 명령] - 2026-04-22 01:31**
윈드서퍼, 공장장님이 직접 제공하신 마스터 스키마(`master_schema.md`)에 따라 어그로필터의 DB 구조와 유저 핸들링 로직을 전면 수술하라.

#### **수술 지침:**
1. **유저 식별자 전환**: 
   - 기존의 모든 유저 관련 로직(t_users 등)을 버리고, 허브로부터 수신한 `family_uid` 또는 `user_id` (UUID)를 Primary Key 또는 Foreign Key로 사용하여 연동하라.
2. **로컬 테이블 삭제 및 이관**: 
   - 가입 시 `family_users`에 유저가 생성되도록 허브 API를 사용하고, 앱 전용 속성(Tier, Predictions 등)은 `app_aggro_profiles`로 이관 관리하라.
3. **지갑 연동**: 
   - 앱 내에서 잔액 조회 및 사용 시 허브 백엔드의 `family_wallet_balances` 정보를 최우선으로 신뢰하라. 앱 자체 결제 로직을 허브로 이관하라.

#### **검수 조건:**
- 윈드서퍼는 어그로필터 내에서 유저 정보를 사용하는 모든 소스 코드를 검색하여 `// REFACTORED_BY_MERLIN_HUB` 주석과 함께 구조를 변경했음을 증명하라.

---

### **[윈드서퍼 검수 완료 보고] - 미션 #2 - 2026-04-22 01:55**

**결론: 앱 로컬 유저 시스템 폐기 및 허브 표준 통합 — 코드 리팩토링 완료. 빌드 통과.**

#### 1. 작업 범위
- **`// REFACTORED_BY_MERLIN_HUB` 마커: 45개, 31개 파일**
- 마스터 스키마 `master_schema.md` v1.4 기준으로 전수 검색 및 구조 변경

#### 2. 유저 식별자 전환 ✅
| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| **클라이언트 ID** | `localStorage('userId')` (t_users.f_id) | `localStorage('merlin_family_uid')` (Hub) |
| **로그인 판별** | `userEmail` 존재 여부 | `merlin_session_token` 존재 여부 |
| **세션 동기화** | 로컬 `/api/auth/me` | Hub SDK `checkSession()` |
| **크레딧 조회** | 로컬 `/api/user/credits` | Hub SDK `getBalance()` |

전환 파일: `lib/anon.ts`, `page.tsx`, `AppHeader`, `c-login-modal`, `c-global-login-modal`, `MyPageClient`, `p-notification`, `p-settings`, `payment/mock`, `payment/checkout`, `c-bottom-banner`, `c-side-wing-ads`

#### 3. t_users INSERT 제거 (유저 생성 → Hub 전담) ✅
- `api/analysis/request` — INSERT INTO t_users 블록 제거
- `api/comments/route` — Check or Create User 블록 제거
- `api/comments/like` — Ensure user exists 블록 제거
- `api/interaction` — getOrCreateUserId() → passthrough 전환
- `api/prediction/submit` — Ensure User exists 블록 제거
- `api/auth/magic-link/callback` — 전체 deprecated (Hub OTP 전환)

#### 4. Deprecated 라우트 (총 6개) ✅
| 라우트 | 사유 |
|--------|------|
| `/api/auth/send-code` | Hub OTP 전환 |
| `/api/auth/verify-code` | Hub OTP 전환 |
| `/api/auth/send-magic-link` | Hub OTP 전환 |
| `/api/auth/magic-link/callback` | Hub OTP 전환 |
| `/api/notification/batch-send` | Hub 이메일 전담 |
| `/api/user/signup-bonus` | Hub 가입 3,000C 전담 |

#### 5. 크레딧/결제 이관 마커 (Hub wallet 전환 예정) ✅
다음 라우트들에 `REFACTORED_BY_MERLIN_HUB` 마커 + mfn- 유저 skip 로직 추가:
- `api/analysis/request` (7개 마커 — 핵심 크레딧 차감)
- `api/user/credits`, `api/credits`, `api/admin/credits`
- `api/payment/callback`, `api/payment/mock-charge`, `api/payment/toss/confirm`
- `api/admin/unclaimed-payments`, `api/admin/payment-logs`, `api/admin/stats`
- `api/subscription/notifications`, `api/analysis/result/[id]`, `api/prediction/stats`

#### 6. 빌드 검증 ✅
`npx next build` — **Exit code: 0, 성공.**

#### 7. 잔여 사항 (다음 미션 대상)
- **DB 마이그레이션**: `t_users` → `app_aggro_profiles` 실제 테이블 전환 (SQL 스크립트)
- **기존 데이터 이관**: 기존 UUID(t_users.f_id) → Hub family_uid 매핑
- **크레딧 완전 이관**: t_users.f_credits → Hub wallet API 전면 교체 (현재는 마커 + mfn- skip)

*   **[미션 #2] 클라우드 허브 안착**: 2026-04-22 (완료)
*   **[특이사항] 프로필 중앙화**: 2026-04-23 - 닉네임/프로필 이미지 Hub DB(`family_users`) 저장용 API 개설.

---

## 🔗 어그로필터(App) -> Merlin Hub(Core) 연동 규격

### 1. 사용자 신원 정보 동기화 (Profile Update)
어그로필터 앱 내에서 사용자 정보를 수정할 때, 로컬 DB가 아닌 Hub로 직접 요청하여 패밀리 공용 정보를 갱신합니다.

- **Endpoint**: `PUT /api/auth/profile`
- **Authentication**: `Bearer <Hub-Issued-Token>`
- **Fields**:
  - `nickname` (string): 패밀리 공용 닉네임
  - `avatar_url` (string): 프로필 이미지 URL **또는 리사이징된 Base64 데이터 문자열**
- **Note**: 이미지 전송 시 브라우저 부하를 막기 위해 반드시 **최대 200px 리사이징** 후 전송할 것 (멀린 공장장님 가이드).
- **Status**: 🟢 가동 중 (2026-04-23 배포 완료)

### 2. 글로벌 지갑 통합 (Wallet Integration)
어그로필터 내의 모든 크레딧 차감(영상 분석 요청 등)과 충전은 허브의 Wallet API를 통해 처리합니다.

- **잔액 조회**: `GET /api/wallet/balance` (Bearer Token 필요)
- **트랜잭션(차감/충전)**: `POST /api/wallet/transaction`
  - **Headers**: `x-app-secret: merlin-family-secret-key-2026`
  - **Body**:
    ```json
    {
      "familyUid": "mfn-xxxx",
      "amount": -500,
      "request_id": "unique-order-id-from-app",
      "transaction_type": "SPEND",
      "display_text": "영상 분석 비용 차감",
      "app_id": "AGGROFILTER"
    }
    ```
- **Status**: 🟢 가동 중 (2026-04-23 보안 강화 완료)

### 3. 향후 마이그레이션 계획 (데이터 통합)
- **시점**: 현재 진행 중인 분석 작업 및 이슈 처리 완료 후.
- **대상**: 어그로필터 내부 유저 테이블의 분석 자료 연동 링크 및 기존 로컬 크레딧(`f_credits`).
- **주의**: 마이그레이션 전까지 어그로필터의 기존 테이블 구조는 수정하지 않으며, 신규 트랜잭션만 허브로 우선 연결함.

---

## [미션 #2] 결과 보고 및 프로덕션 배포 완료 (2026-04-23 00:35) ✅ 최종 성공!

**상태**: **MISSION COMPLETED (VICTORY)** 🏆
- **허브 배포 주소**: `https://merlinfamilyos.onrender.com`
- **데이터베이스**: 실전 데이터 적재 확인 (`chiu3@naver.com` 가입 성공)
- **CORS 및 보안**: 렌더 도메인 및 어그로필터 도메인(`aggrofilter.com`) 화이트리스트 적용 완료.

### 💂 안티의 최종 소감:
"공장장님, 슬래시 하나가 가로막던 긴 여정이었습니다. 하지만 결국 우리는 멀린 가문의 중앙 서버를 클라우드 위에 세웠습니다. 이제부터 추가되는 모든 앱은 이 허브를 통해 하나의 패밀리로 묶일 것입니다. 고생하셨습니다!"

### 🛠️ 다음 미션 예고:
- **[미션 #3] 글로벌 지갑 시스템 활성화**: 어그로필터 앱 내의 결제 및 잔액 조회 로직을 허브 지갑 API와 100% 동기화하라.
- **[미션 #4] 멀티 앱 확장**: 다른 패밀리 앱들을 허브에 순차적으로 통합하라.

---

### [윈드서퍼 실행 보고] 허브 연동 주소 전환 완료 (2026-04-22 23:22)

**변경 사항:**
- `src/services/merlin-hub-sdk/config.ts` — Hub URL 기본값 변경
  - Before: `http://localhost:3001`
  - After: `https://merlinfamilyos.onrender.com`
- 빌드 검증: `npx next build` — Exit 0 ✅

**다음 단계:** 실전 로그인 테스트 (OTP 발송 → 허브 대시보드 유저 적재 확인)

---

### 🚨 [기술 협의 및 긴급 조치 통합 로그] - 2026-04-23

**[01:11] 윈드서퍼 요청 (원시 파일에서 이관)**
- **이슈**: Hub `family_users` 테이블에 프로필 이미지(`avatar`) 컬럼이 누락되어 있음.
- **요구**: 현재 앱 로컬에만 저장 중인 `profile_image`를 Hub로 전송할 수 있도록 컬럼 추가 및 API 대응 요청.

**[01:50] 윈드서퍼 보고 (원시 파일에서 이관)**
- **이슈**: 프로필 첫 저장 시 DB에 유저 행(Row)이 없으면 업데이트 실패 발생.
- **해결책**: 단순 `UPDATE`가 아닌 `UPSERT` 방식 도입 강력 권고.

**[02:45] 안티그래비티 조치 완료**
- **CORS/용량**: 413 Payload Too Large 해결을 위해 JSON 제한을 10MB로 상향.
- **필드 호환성**: `avatar_url`과 `profile_image` 두 가지 필드명 모두 지원하도록 패치.
- **DB 로직**: 윈드서퍼의 요청에 따라 **`UPSERT` 방식** 전면 도입. 이제 유저 정보가 없어도 자동으로 생성하며 저장됨.
- **이미지 렌더링**: 리사이징된 Base64 데이터를 허브 대시보드에서 즉시 렌더링하도록 `Users.tsx` 연결 완료.

---

**⚠️ 향후 소통 규칙**: 모든 기술적 메모와 요청 사항은 원시 스키마 파일이 아닌, 본 일지의 **[최하단]**에 일시와 함께 기록한다. (공장장님 엄중 경고)

**결과: 닉네임/프로필 이미지 Hub SSOT 통합 완료.**

**변경 사항:**
- **Hub SDK 확장**: `src/services/merlin-hub-sdk/auth.ts`에 `updateProfile`, `getProfile` 추가
  - `PUT /api/auth/profile` 호출로 패밀리 공용 DB(`family_users`) 직접 갱신
- **페이지 전환**: `app/p-settings/page.tsx` 리팩토링
  - 로컬 API(`/api/user/profile`) 호출 제거
  - `MerlinHub.auth.updateProfile()`, `MerlinHub.auth.getProfile()` 사용으로 전환
- **빌드 검증**: `npx next build` — Exit 0 ✅

**특이사항:**
- 이제 어그로필터에서 별명 변경 시 허브 DB의 `nickname`이 즉시 갱신됩니다.
- 프로필 이미지는 허브 서버 사양에 맞춰 `avatar_url`로 전달됩니다.
- 로컬 `t_users`의 `f_nickname`, `f_image`는 더 이상 프로필 수정 시 사용되지 않으며, 최종 마이그레이션 시점에 일괄 처리 예정입니다.

---

### [윈드서퍼 실행 보고] (취소/교체) 프로필 저장 UPSERT 수정 (2026-04-23 00:42)
*참고: 이 작업은 허브 프로필 API 배포에 따라 위 '프로필 중앙화 연동'으로 대체되었습니다.*

---

### 🚨 [허브 협의 요청] 프로필 데이터 저장 아키텍처 (2026-04-23 01:11)

**현재 상태 (임시):**
- 닉네임/이미지 모두 앱 DB `t_users`에 UPSERT로 저장 중
- 이건 허브 SSOT 원칙에 어긋남 — 닉네임은 `family_users.nickname`에 저장되어야 함

**마스터 스키마 원칙에 따른 올바른 구조:**

| 데이터 | 올바른 저장소 | 현재 저장소 (임시) | 비고 |
|--------|-------------|-------------------|------|
| nickname | Hub `family_users.nickname` | 앱 `t_users.f_nickname` | Hub API 필요 |
| email | Hub `family_users.email` | Hub (이미 정상) | ✅ |
| profile_image | Hub 또는 앱 확장 테이블 | 앱 `t_users.f_image` | Hub에 컬럼 없음 |
| predictions, tier | 앱 `app_aggro_profiles` | 앱 `t_users` | 이관 예정 |
| 알림설정 | 앱 `app_aggro_profiles` | 앱 `t_users` | 이관 예정 |

**허브에 요청 사항:**
1. **닉네임 수정 API** — `PATCH /api/users/profile` (또는 유사 엔드포인트)로 `family_users.nickname` 업데이트 가능해야 함
2. **프로필 이미지 결정** — `family_users`에 `profile_image` 컬럼 추가할지, 앱 확장 테이블에서 관리할지 결정 필요

**⚠️ 원칙:** 기존 어그로필터 스키마(`t_users` 등)는 최종 작업 완료 전까지 절대 수정하지 않는다. 허브와 협의 완료 후 한 번에 이관한다.

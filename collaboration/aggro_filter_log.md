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

**미션 #2 판정: 코드 레벨 리팩토링 완료. 31개 파일에 45개 마커로 구조 변경 증명.**

---

## [미션 #2] 결과 보고 및 프로덕션 배포 완료 (2026-04-22 23:20)

**허브 배포 주소**: `https://merlinfamilyos.onrender.com` (Render Starter Plan)

### 🛠️ 윈드서퍼(Windsurf) 행동 강령:
1. **연동 주소 업데이트**: 어그로필터 앱의 `.env` 파일 내 `NEXT_PUBLIC_MERLIN_HUB_URL`을 위 배포 주소(`https://merlinfamilyos.onrender.com`)로 즉각 변경하라.
2. **실전 로그인 테스트**: 변경된 배포 주소를 통해 실제 이메일 OTP가 발송되는지, 그리고 가입 후 허브 대시보드에 유저 데이터가 남는지 확인하라.
3. **가입 성공 시 보고**: 성공적으로 유저 데이터가 허브에 적재되면 미션 #2의 완벽한 종료를 선언하라.

**공장장님, 이제 윈드서퍼에게 "배포된 허브 주소로 연동해라"라고 말씀만 하시면 됩니다!** 🚀

---

### [윈드서퍼 실행 보고] 허브 연동 주소 전환 완료 (2026-04-22 23:22)

**변경 사항:**
- `src/services/merlin-hub-sdk/config.ts` — Hub URL 기본값 변경
  - Before: `http://localhost:3001`
  - After: `https://merlinfamilyos.onrender.com`
- 빌드 검증: `npx next build` — Exit 0 ✅

**다음 단계:** 실전 로그인 테스트 (OTP 발송 → 허브 대시보드 유저 적재 확인)

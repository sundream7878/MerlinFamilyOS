-- [Merlin Family OS Hub] 통합 데이터베이스 스키마 v1.2
-- 마지막 업데이트: 2026-04-22

-- 1. 앱 마스터 정보
CREATE TABLE IF NOT EXISTS family_apps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT '준비중',
    open_date TEXT,
    secret_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 사용자 마스터 정보
CREATE TABLE IF NOT EXISTS family_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    family_uid TEXT UNIQUE NOT NULL,
    nickname TEXT,
    region TEXT,
    first_app_id TEXT REFERENCES family_apps(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 앱별 가입 및 보상 이력
CREATE TABLE IF NOT EXISTS family_user_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES family_users(id),
    app_id TEXT REFERENCES family_apps(id),
    reward_stage INTEGER DEFAULT 0, -- 0: 미지급, 1: 1단계 완료, 2: 2단계 완료
    last_registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, app_id)
);

-- 4. 통합 지갑 및 크레딧 트랜잭션
CREATE TABLE IF NOT EXISTS family_wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES family_users(id),
    app_id TEXT NOT NULL,
    amount BIGINT NOT NULL,
    request_id TEXT UNIQUE NOT NULL,
    transaction_type TEXT NOT NULL, -- 'REWARD', 'PAYMENT', 'REFUND'
    display_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

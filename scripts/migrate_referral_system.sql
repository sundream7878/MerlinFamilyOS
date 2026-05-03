-- 1. family_users 테이블에 고유 추천 코드 컬럼 추가
ALTER TABLE family_users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. 기존 유저들에게 랜덤 추천 코드 부여 (UUID 앞 8자리 활용)
UPDATE family_users 
SET referral_code = upper(substring(id::text, 1, 8)) 
WHERE referral_code IS NULL;

-- 3. 추천인 관계 기록 테이블 생성
CREATE TABLE IF NOT EXISTS family_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES family_users(id), -- 추천인 (초대한 사람)
  invitee_id UUID REFERENCES family_users(id),  -- 피추천인 (초대받은 사람)
  app_id TEXT,                                  -- 가입이 발생한 앱 ID
  reward_amount_referrer BIGINT DEFAULT 50,     -- 추천인 보상액
  reward_amount_invitee BIGINT DEFAULT 100,     -- 피추천인 보상액
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(invitee_id)                            -- 한 명은 한 번만 추천받을 수 있음
);

-- 4. 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON family_users(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON family_referrals(referrer_id);

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSchema() {
  console.log('🚀 Starting Hub Database Schema Update (Referral System)...');

  // 1. family_users 테이블에 referral_code 컬럼 추가
  console.log('Adding referral_code column to family_users...');
  const { error: colError } = await supabase.rpc('exec_sql', {
    sql_query: `ALTER TABLE family_users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;`
  });
  
  if (colError) {
    // 만약 exec_sql RPC가 없으면 에러가 날 수 있습니다. 이 경우 수동 실행 안내가 필요할 수 있습니다.
    console.error('❌ Failed to add column via RPC:', colError.message);
    console.log('💡 RPC가 없는 경우 Supabase SQL Editor에서 아래 SQL을 실행해주세요:');
    console.log('ALTER TABLE family_users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;');
  } else {
    console.log('✅ referral_code column added (or already exists).');
  }

  // 2. family_referrals 테이블 생성
  console.log('Creating family_referrals table...');
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS family_referrals (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          referrer_id UUID REFERENCES family_users(id),
          invitee_id UUID REFERENCES family_users(id),
          app_id TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(invitee_id)
      );
    `
  });

  if (tableError) {
    console.error('❌ Failed to create table via RPC:', tableError.message);
  } else {
    console.log('✅ family_referrals table created (or already exists).');
  }

  // 3. 기존 유저들에게 추천 코드 부여 (없는 경우만)
  console.log('Generating referral codes for existing users...');
  const { error: updateError } = await supabase.rpc('exec_sql', {
    sql_query: `UPDATE family_users SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)) WHERE referral_code IS NULL;`
  });

  if (updateError) {
    console.error('❌ Failed to update codes via RPC:', updateError.message);
  } else {
    console.log('✅ All existing users now have referral codes.');
  }

  console.log('✨ Schema Update Complete!');
}

updateSchema();

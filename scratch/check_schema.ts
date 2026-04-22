import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// URL 정제 (끝에 /rest/v1/ 등이 있으면 제거)
if (supabaseUrl.includes('.supabase.co')) {
  supabaseUrl = supabaseUrl.split('.supabase.co')[0] + '.supabase.co';
}

console.log('Cleaned URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking family_users table schema...');
  const { data, error } = await supabase
    .from('family_users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Available columns:', Object.keys(data[0] || {}));
  }
}

checkSchema();

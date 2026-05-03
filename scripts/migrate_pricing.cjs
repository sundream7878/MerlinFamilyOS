const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('Starting migration of legacy videos...');
  
  const pgClient = new Client({
    connectionString: "postgresql://postgres.iwzwiimyxfduuwulpugu:pVw0WjwsG3ZgZpM1@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"
  });

  try {
    await pgClient.connect();
    const res = await pgClient.query('SELECT f_video_id FROM t_videos');
    const videos = res.rows;
    console.log(`Found ${videos.length} videos in AggroFilter DB.`);
    
    let successCount = 0;
    for (const v of videos) {
      if (!v.f_video_id) continue;
      
      const { error } = await supabase.from('family_aggro_video_pricing').upsert({
        video_id: v.f_video_id,
        raw_token_cost: 20.0 / 3.0,
        margin_multiplier: 3,
        fixed_coin_price: 20,
        created_at: new Date().toISOString()
      }, { onConflict: 'video_id' });
      
      if (error) {
        console.error(`Failed to insert ${v.f_video_id}:`, error.message);
      } else {
        successCount++;
      }
    }
    console.log(`Migration completed successfully! Inserted ${successCount} records into Hub DB with 20C fixed price.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pgClient.end();
  }
}

main();

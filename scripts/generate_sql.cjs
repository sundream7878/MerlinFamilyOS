const { Client } = require('pg');
const fs = require('fs');

async function main() {
  console.log('Fetching videos to generate SQL file...');
  
  const pgClient = new Client({
    connectionString: "postgresql://postgres.iwzwiimyxfduuwulpugu:pVw0WjwsG3ZgZpM1@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"
  });

  try {
    await pgClient.connect();
    const res = await pgClient.query('SELECT f_video_id FROM t_videos WHERE f_video_id IS NOT NULL');
    const videos = res.rows;
    console.log(`Found ${videos.length} videos in AggroFilter DB.`);
    
    let sql = `INSERT INTO public.family_aggro_video_pricing (video_id, raw_token_cost, margin_multiplier, fixed_coin_price)\nVALUES\n`;
    
    const values = videos.map(v => `  ('${v.f_video_id}', 6.666, 3, 20)`).join(',\n');
    
    sql += values + `\nON CONFLICT (video_id) DO NOTHING;`;
    
    fs.writeFileSync('./scripts/insert_400_videos.sql', sql);
    console.log('Successfully generated SQL file: d:\\MerlinFamilyOS\\scripts\\insert_400_videos.sql');
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await pgClient.end();
  }
}

main();

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_eL1RqxnyGM3d@ep-dark-wildflower-a4ecipb9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to database successfully');
    
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    
    await client.end();
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

testConnection();
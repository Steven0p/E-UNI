require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = schema
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      await conn.query(statement);
    }
    console.log(`Migration terminée : ${statements.length} instructions exécutées.`);
  } finally {
    conn.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Échec de la migration :', err.message);
  process.exit(1);
});

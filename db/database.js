const { createClient } = require('@libsql/client');

let db;

// In locale usa SQLite file, in produzione usa Turso
if (process.env.TURSO_DATABASE_URL) {
  db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
} else {
  db = createClient({
    url: 'file:./db/cacca-tracker.sqlite',
  });
}

// Crea la tabella se non esiste
async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      count INTEGER NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Database inizializzato');
}

module.exports = { db, initializeDatabase };

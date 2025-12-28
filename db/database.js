const Database = require('better-sqlite3');
const path = require('path');

// Percorso al file SQLite (usa ENV per Render, altrimenti locale)
const dbPath = process.env.DB_PATH || path.join(__dirname, 'cacca-tracker.sqlite');

// Apri o crea il database
const db = new Database(dbPath);

// Abilita foreign keys
db.pragma('journal_mode = wal');

// Crea la tabella se non esiste
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    count INTEGER NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

db.exec(createTableSQL);

module.exports = db;

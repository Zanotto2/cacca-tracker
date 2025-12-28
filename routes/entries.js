const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// GET /api/entries - Recupera gli entries con filtri opzionali
// Query params: date (YYYY-MM-DD), from (YYYY-MM-DD), to (YYYY-MM-DD)
router.get('/entries', async (req, res) => {
  try {
    const { date, from, to } = req.query;
    let query = 'SELECT id, date, time, count, note, created_at FROM entries';
    const args = [];
    const conditions = [];

    if (date) {
      conditions.push('date = ?');
      args.push(date);
    }
    if (from) {
      conditions.push('date >= ?');
      args.push(from);
    }
    if (to) {
      conditions.push('date <= ?');
      args.push(to);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY date DESC, time DESC';

    const result = await db.execute({ sql: query, args });
    res.json(result.rows);
  } catch (error) {
    console.error('Errore GET /api/entries:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/entries - Crea un nuovo entry
// Body: { date: "YYYY-MM-DD", time: "HH:MM", count: 1, note: "optional" }
router.post('/entries', async (req, res) => {
  try {
    const { date, time, count, note } = req.body;

    // Validazione base
    if (!date || !time || count === undefined) {
      return res.status(400).json({ error: 'Campo obbligatorio mancante: date, time, count' });
    }

    const result = await db.execute({
      sql: 'INSERT INTO entries (date, time, count, note) VALUES (?, ?, ?, ?)',
      args: [date, time, parseInt(count), note || null]
    });

    // Recupera l'entry appena creata
    const newEntry = await db.execute({
      sql: 'SELECT * FROM entries WHERE id = ?',
      args: [Number(result.lastInsertRowid)]
    });

    res.status(201).json(newEntry.rows[0]);
  } catch (error) {
    console.error('Errore POST /api/entries:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

module.exports = router;

module.exports = router;

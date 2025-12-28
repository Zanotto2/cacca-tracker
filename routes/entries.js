const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/entries - Recupera gli entries con filtri opzionali
// Query params: date (YYYY-MM-DD), from (YYYY-MM-DD), to (YYYY-MM-DD)
router.get('/entries', (req, res) => {
  try {
    let query = 'SELECT id, date, time, count, note, created_at FROM entries';
    const params = [];

    const { date, from, to } = req.query;

    if (date) {
      // Filtro per data esatta
      query += ' WHERE date = ?';
      params.push(date);
    } else {
      // Filtri per intervallo
      if (from) {
        query += ' WHERE date >= ?';
        params.push(from);
      }
      if (to) {
        query += (from ? ' AND' : ' WHERE') + ' date <= ?';
        params.push(to);
      }
    }

    query += ' ORDER BY date DESC, time DESC';

    const stmt = db.prepare(query);
    const entries = stmt.all(...params);

    res.json(entries);
  } catch (error) {
    console.error('Errore GET /api/entries:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/entries - Crea un nuovo entry
// Body: { date: "YYYY-MM-DD", time: "HH:MM", count: 1, note: "optional" }
router.post('/entries', (req, res) => {
  try {
    const { date, time, count, note } = req.body;

    // Validazione base
    if (!date || !time || count === undefined) {
      return res.status(400).json({ error: 'Campo obbligatorio mancante: date, time, count' });
    }

    const stmt = db.prepare(
      'INSERT INTO entries (date, time, count, note) VALUES (?, ?, ?, ?)'
    );

    const info = stmt.run(date, time, count, note || null);

    res.status(201).json({
      id: info.lastInsertRowid,
      date,
      time,
      count,
      note: note || null,
    });
  } catch (error) {
    console.error('Errore POST /api/entries:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

module.exports = router;

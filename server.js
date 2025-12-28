const express = require('express');
const path = require('path');
const db = require('./db/database');
const entriesRouter = require('./routes/entries');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotte API
app.use('/api', entriesRouter);

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`\n✅ Server avviato su http://localhost:${PORT}`);
  console.log(`📱 Apri il browser e vai su http://localhost:${PORT}\n`);
});

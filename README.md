# 🚽 Cacca Tracker

Un semplice tracker web per registrare e monitorare gli eventi giornalieri.

## Tech Stack
- Node.js + Express
- SQLite (better-sqlite3)
- Vanilla JS frontend

## Setup locale

```bash
npm install
npm start
```

Apri http://localhost:3000

## Deploy su Render

1. Pusha il repo su GitHub
2. Vai su [render.com](https://render.com) e crea un account
3. Clicca **New > Blueprint** e collega il repo GitHub
4. Render leggerà `render.yaml` e creerà automaticamente il servizio con disco persistente
5. Attendi il deploy (~2-3 minuti)
6. L'app sarà disponibile su `https://cacca-tracker.onrender.com`

### Alternativa: Deploy manuale
1. **New > Web Service** su Render
2. Collega il repo GitHub
3. Runtime: **Node**
4. Build command: `npm install`
5. Start command: `npm start`
6. Aggiungi un **Disk**: mount path `/data`, size 1GB
7. Aggiungi ENV: `DB_PATH=/data/cacca-tracker.sqlite`

## API

- `GET /api/entries` - Lista eventi (filtri: `?date=`, `?from=`, `?to=`)
- `POST /api/entries` - Crea evento (`{ date, time, count, note }`)

# 🚽 Cacca Tracker - Documentazione Completa

## Indice
1. [Cos'è questa applicazione](#cosè-questa-applicazione)
2. [Stack tecnologico](#stack-tecnologico)
3. [Struttura del progetto](#struttura-del-progetto)
4. [Architettura e flusso dati](#architettura-e-flusso-dati)
5. [Diagramma di flusso](#diagramma-di-flusso)
6. [Collegamento tra i file](#collegamento-tra-i-file)
7. [API Reference](#api-reference)
8. [Cosa hai imparato](#cosa-hai-imparato)
9. [Possibili miglioramenti futuri](#possibili-miglioramenti-futuri)

---

## Cos'è questa applicazione

**Cacca Tracker** è un'applicazione web full-stack che permette di registrare e monitorare gli eventi di defecazione giornalieri. È stata creata come progetto didattico per imparare:

- Come strutturare un progetto web moderno
- Come far comunicare frontend e backend
- Come persistere dati in un database
- Come deployare un'applicazione in cloud

### Funzionalità principali:
- ✅ Registrare un evento con data, ora, conteggio e note opzionali
- ✅ Visualizzare lo storico degli eventi in una tabella
- ✅ Filtrare gli eventi per data (via API)
- ✅ Dati persistenti su database cloud (Turso)
- ✅ Accessibile da qualsiasi dispositivo via URL pubblico

---

## Stack tecnologico

| Componente | Tecnologia | Ruolo |
|------------|------------|-------|
| **Frontend** | HTML, CSS, JavaScript (vanilla) | Interfaccia utente nel browser |
| **Backend** | Node.js + Express | Server che gestisce le API |
| **Database** | SQLite (via Turso) | Persistenza dei dati |
| **Hosting App** | Render | Esecuzione del server Node.js |
| **Hosting DB** | Turso | Database SQLite cloud |
| **Versioning** | Git + GitHub | Controllo versione e repository |

---

## Struttura del progetto

```
cacca-tracker/
│
├── server.js              # 🚀 Entry point - Avvia il server Express
├── package.json           # 📦 Dipendenze e script npm
├── render.yaml            # ☁️  Configurazione deploy Render
├── .gitignore             # 🙈 File da ignorare in Git
├── README.md              # 📖 Documentazione breve
├── DOCS.md                # 📚 Questa documentazione
│
├── db/
│   └── database.js        # 🗄️  Connessione e init database Turso/SQLite
│
├── routes/
│   └── entries.js         # 🛣️  Definizione rotte API (GET, POST)
│
└── public/                # 📁 File statici serviti al browser
    ├── index.html         # 🌐 Pagina HTML principale
    ├── style.css          # 🎨 Stili CSS
    └── app.js             # ⚡ Logica frontend JavaScript
```

---

## Architettura e flusso dati

L'applicazione segue il pattern **Client-Server** con architettura **a 3 livelli**:

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ index.html  │  │  style.css  │  │   app.js    │              │
│  │   (struttura)│  │  (stile)    │  │  (logica)   │              │
│  └─────────────┘  └─────────────┘  └──────┬──────┘              │
│                                           │                      │
│                                     fetch API                    │
└───────────────────────────────────────────┼─────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Render.com)                        │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      │
│  │  server.js  │ ───▶ │   Express   │ ───▶ │routes/      │      │
│  │  (entry)    │      │ (middleware)│      │entries.js   │      │
│  └─────────────┘      └─────────────┘      └──────┬──────┘      │
│                                                   │              │
│                                            db.execute()          │
└───────────────────────────────────────────────────┼─────────────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (Turso)                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    entries (tabella)                     │    │
│  │  id | date | time | count | note | created_at           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagramma di flusso

### Flusso 1: Caricamento pagina

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Browser  │     │  Express │     │  Routes  │     │  Turso   │
│  apre    │     │  server  │     │ entries  │     │    DB    │
│   URL    │     │          │     │          │     │          │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │  GET /         │                │                │
     │───────────────▶│                │                │
     │                │                │                │
     │  index.html    │                │                │
     │◀───────────────│                │                │
     │                │                │                │
     │  GET /api/entries               │                │
     │────────────────────────────────▶│                │
     │                │                │                │
     │                │                │  SELECT * ...  │
     │                │                │───────────────▶│
     │                │                │                │
     │                │                │    [rows]      │
     │                │                │◀───────────────│
     │                │                │                │
     │        JSON array               │                │
     │◀────────────────────────────────│                │
     │                │                │                │
     │  Mostra tabella                 │                │
     ▼                │                │                │
```

### Flusso 2: Salvataggio nuovo evento

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Utente  │     │  app.js  │     │  Routes  │     │  Turso   │
│ compila  │     │ frontend │     │ entries  │     │    DB    │
│  form    │     │          │     │          │     │          │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │  Click Submit  │                │                │
     │───────────────▶│                │                │
     │                │                │                │
     │                │  POST /api/entries              │
     │                │  {date, time, count, note}      │
     │                │───────────────▶│                │
     │                │                │                │
     │                │                │  INSERT INTO...│
     │                │                │───────────────▶│
     │                │                │                │
     │                │                │   lastInsertId │
     │                │                │◀───────────────│
     │                │                │                │
     │                │   201 Created  │                │
     │                │   {new entry}  │                │
     │                │◀───────────────│                │
     │                │                │                │
     │                │  Ricarica entries               │
     │                │───────────────▶│ ... (GET)      │
     │                │                │                │
     │  Alert successo│                │                │
     │◀───────────────│                │                │
     ▼                │                │                │
```

---

## Collegamento tra i file

### 1. `server.js` → Entry Point

```javascript
// Importa i moduli
const { initializeDatabase } = require('./db/database');  // ← collega db
const entriesRouter = require('./routes/entries');        // ← collega routes

// Configura Express
app.use('/api', entriesRouter);  // ← monta le rotte su /api/*
app.use(express.static('public')); // ← serve i file in public/
```

### 2. `db/database.js` → Connessione Database

```javascript
// Esporta il client e la funzione init
module.exports = { db, initializeDatabase };

// Usato da:
// - server.js (per inizializzare)
// - routes/entries.js (per le query)
```

### 3. `routes/entries.js` → Logica API

```javascript
// Importa la connessione db
const { db } = require('../db/database');

// Definisce le rotte
router.get('/entries', ...)   // GET /api/entries
router.post('/entries', ...)  // POST /api/entries

// Esporta il router
module.exports = router;
```

### 4. `public/app.js` → Logica Frontend

```javascript
// Comunica col backend via fetch
fetch('/api/entries')           // ← chiama GET
fetch('/api/entries', {POST})   // ← chiama POST

// Manipola il DOM
document.getElementById('entriesBody')  // ← aggiorna tabella
document.getElementById('entryForm')    // ← gestisce form
```

### 5. `public/index.html` → Struttura UI

```html
<!-- Carica gli altri file frontend -->
<link rel="stylesheet" href="style.css">  <!-- ← stili -->
<script src="app.js"></script>            <!-- ← logica -->

<!-- Elementi manipolati da app.js -->
<form id="entryForm">...</form>
<table id="entriesTable">...</table>
```

---

## API Reference

### `GET /api/entries`

Recupera tutti gli eventi registrati.

**Query Parameters (opzionali):**
| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `date` | string | Filtra per data esatta (YYYY-MM-DD) |
| `from` | string | Data inizio intervallo (YYYY-MM-DD) |
| `to` | string | Data fine intervallo (YYYY-MM-DD) |

**Esempio risposta:**
```json
[
  {
    "id": 1,
    "date": "2024-12-28",
    "time": "09:30",
    "count": 1,
    "note": "Tutto regolare",
    "created_at": "2024-12-28 09:31:00"
  }
]
```

### `POST /api/entries`

Crea un nuovo evento.

**Body (JSON):**
```json
{
  "date": "2024-12-28",
  "time": "09:30",
  "count": 1,
  "note": "Opzionale"
}
```

**Risposta (201 Created):**
```json
{
  "id": 1,
  "date": "2024-12-28",
  "time": "09:30",
  "count": 1,
  "note": "Opzionale"
}
```

---

## Cosa hai imparato

### 🔧 Setup Progetto
- Inizializzare un progetto Node.js con `npm init`
- Gestire dipendenze con `package.json`
- Usare `.gitignore` per escludere file dal versioning
- Strutturare cartelle in modo logico (separation of concerns)

### 🌐 Backend Development
- Creare un server HTTP con **Express**
- Definire **rotte API** RESTful (GET, POST)
- Usare **middleware** (express.json, express.static)
- Gestire **errori** e restituire status code appropriati

### 🗄️ Database
- Concetti base di **SQL** (CREATE TABLE, SELECT, INSERT)
- Differenza tra database locale (SQLite file) e cloud (Turso)
- **ORM-less approach**: scrivere query SQL direttamente
- Gestire connessioni **asincrone** con async/await

### 🎨 Frontend Development
- Strutturare HTML semantico
- Stilizzare con CSS (flexbox, gradienti, responsive)
- Manipolare il **DOM** con JavaScript vanilla
- Usare **Fetch API** per chiamate HTTP asincrone
- Gestire **eventi** (submit form, DOMContentLoaded)

### ☁️ DevOps & Deployment
- Versionare codice con **Git**
- Pubblicare su **GitHub**
- Deploy automatico su **Render** (PaaS)
- Configurare **variabili d'ambiente** per secrets
- Usare **database cloud** (Turso) per persistenza

### 🔗 Concetti Architetturali
- Architettura **Client-Server**
- Pattern **3-tier** (Presentation, Logic, Data)
- **API RESTful** e formato JSON
- **Separation of Concerns** (frontend/backend/db separati)
- **Environment-based configuration** (dev vs prod)

---

## Possibili miglioramenti futuri

### Funzionalità
- [ ] **Autenticazione**: login per utenti diversi
- [ ] **Eliminazione**: bottone per cancellare un evento
- [ ] **Modifica**: possibilità di editare un evento
- [ ] **Statistiche**: grafici con medie settimanali/mensili
- [ ] **Export**: scarica dati in CSV/JSON
- [ ] **PWA**: installabile come app su mobile

### Tecnici
- [ ] **TypeScript**: tipizzazione statica
- [ ] **Testing**: unit test con Jest
- [ ] **Validazione**: schema validation con Zod/Joi
- [ ] **Rate limiting**: protezione da abusi
- [ ] **Logging**: Winston o Pino per log strutturati
- [ ] **CI/CD**: GitHub Actions per deploy automatico

### UX/UI
- [ ] **Dark mode**: tema scuro
- [ ] **Animazioni**: transizioni fluide
- [ ] **Notifiche**: toast invece di alert()
- [ ] **Filtri UI**: selettori data nel frontend
- [ ] **Mobile-first**: miglior esperienza su smartphone

---

## Risorse utili

- [Express.js Documentation](https://expressjs.com/)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Turso Documentation](https://docs.turso.tech/)
- [Render Documentation](https://render.com/docs)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

---

*Documentazione generata il 28 Dicembre 2024*
*Progetto didattico - Cacca Tracker v1.0.0*

// Inizializza la data odierna nel form
function initializeForm() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inputDate').value = today;
  
  // Imposta l'ora attuale
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('inputTime').value = `${hours}:${minutes}`;
}

// Carica e mostra gli entries dal server
async function loadEntries() {
  try {
    const response = await fetch('/api/entries');
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }
    
    const entries = await response.json();
    displayEntries(entries);
  } catch (error) {
    console.error('Errore nel caricamento degli entries:', error);
    document.getElementById('loadingMessage').textContent = 'Errore nel caricamento dei dati';
  }
}

// Mostra gli entries nella tabella
function displayEntries(entries) {
  const tbody = document.getElementById('entriesBody');
  const table = document.getElementById('entriesTable');
  const emptyMessage = document.getElementById('emptyMessage');
  const loadingMessage = document.getElementById('loadingMessage');

  // Nascondi i messaggi di loading
  loadingMessage.style.display = 'none';

  if (entries.length === 0) {
    table.style.display = 'none';
    emptyMessage.style.display = 'block';
    return;
  }

  // Mostra la tabella
  table.style.display = 'table';
  emptyMessage.style.display = 'none';

  // Pulisci la tabella
  tbody.innerHTML = '';

  // Popola le righe
  entries.forEach(entry => {
    const row = document.createElement('tr');
    
    // Formatta la data
    const dateObj = new Date(entry.date);
    const formattedDate = dateObj.toLocaleDateString('it-IT', {
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });

    // Formatta created_at
    const createdAt = new Date(entry.created_at);
    const formattedCreatedAt = createdAt.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${entry.time}</td>
      <td><strong>${entry.count}</strong></td>
      <td>${entry.note || '-'}</td>
      <td><small>${formattedCreatedAt}</small></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Gestisci il submit del form
document.getElementById('entryForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = document.getElementById('inputDate').value;
  const time = document.getElementById('inputTime').value;
  const count = parseInt(document.getElementById('inputCount').value, 10);
  const note = document.getElementById('inputNote').value.trim();

  // Validazione semplice
  if (!date || !time || !count) {
    alert('Per favore, riempî tutti i campi obbligatori');
    return;
  }

  try {
    const response = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date,
        time,
        count,
        note: note || null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
    }

    // Reset del form
    document.getElementById('entryForm').reset();
    initializeForm();

    // Ricarica gli entries
    await loadEntries();

    // Feedback all'utente
    alert('✅ Evento registrato con successo!');
  } catch (error) {
    console.error('Errore nel salvataggio:', error);
    alert(`❌ Errore: ${error.message}`);
  }
});

// Carica gli entries all'avvio della pagina
document.addEventListener('DOMContentLoaded', () => {
  initializeForm();
  loadEntries();
});

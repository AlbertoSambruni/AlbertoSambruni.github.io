class Indizio {
  constructor(id, testo, emoji, coordinate, soluzione, punti) {
    this.id          = id;
    this.testo       = testo;
    this.emoji       = emoji;
    this.coordinate  = coordinate;   // { lat, lon }
    this.soluzione   = soluzione.toUpperCase();
    this.punti       = punti;
    this.risolto     = false;
  }

  verifica(risposta) {
    return risposta.trim().toUpperCase() === this.soluzione;
  }
}


const INDIZI = [
  new Indizio(
    1,
    '🏛️ Il primo segreto si nasconde dove l\'acqua incontra la pietra antica. Cerca il simbolo inciso sul lato nord del ponte più vecchio della città.',
    '🌉',
    { lat: 45.4654, lon: 9.1859 },
    'PIETRA',
    100
  ),
  new Indizio(
    2,
    '📚 Le parole dei saggi ti guidano. Vai dove migliaia di storie vivono in silenzio e cerca lo scaffale con la lettera X.',
    '📖',
    { lat: 45.4668, lon: 9.1880 },
    'BIBLIOTECA',
    150
  ),
  new Indizio(
    3,
    '🌳 La natura nasconde i suoi tesori. Nel giardino pubblico, trova l\'albero più alto e cerca ai suoi piedi.',
    '🌲',
    { lat: 45.4640, lon: 9.1900 },
    'RADICE',
    200
  ),
  new Indizio(
    4,
    '🔔 Segui il suono delle ore. La torre che scandisce il tempo custodisce l\'ultimo segreto sul suo ingresso.',
    '🕰️',
    { lat: 45.4620, lon: 9.1870 },
    'TEMPO',
    300
  ),
];

const RAGGIO_VICINANZA = 100; // metri — entro questa distanza si sblocca la risposta

//parametri gioco
const stato = {
  nomeGiocatore:    '',
  punteggio:        0,
  vite:             3,
  indizioCorrente:  0,
  partitaTerminata: false,
  modalitaDemo:     false,   // true se GPS non disponibile → usa distanza simulata
};


//roba del dom
const el = {
  // Stato header
  nomeGiocatore:  document.querySelector('#nome-giocatore'),
  punteggio:      document.querySelector('#punteggio'),
  vite:           document.querySelector('#vite'),
  contatore:      document.querySelector('#contatore'),

  // Schermate
  schermataAvvio: document.querySelector('#schermata-avvio'),
  schermataGioco: document.querySelector('#schermata-gioco'),
  schermataFine:  document.querySelector('#schermata-fine'),

  // Avvio
  inputNome:      document.querySelector('#input-nome'),
  btnIniziaAvv:   document.querySelector('#btn-inizia'),

  // Indizio
  cardIndizio:    document.querySelector('#card-indizio'),
  badgeNumero:    document.querySelector('#badge-numero'),
  indizioPunti:   document.querySelector('#indizio-punti'),
  emojiIndizio:   document.querySelector('#emoji-indizio'),
  testoIndizio:   document.querySelector('#testo-indizio'),

  // Distanza
  statoDistanza:  document.querySelector('#stato-distanza'),
  barraDistanza:  document.querySelector('#barra-distanza'),
  testoDistanza:  document.querySelector('#testo-distanza'),

  // Azioni
  btnSonoQui:     document.querySelector('#btn-sono-qui'),
  areaSoluzione:  document.querySelector('#area-soluzione'),
  inputRisposta:  document.querySelector('#input-risposta'),
  btnInvia:       document.querySelector('#btn-invia'),
  feedbackRisp:   document.querySelector('#feedback-risposta'),

  // Log
  logEventi:      document.querySelector('#log-eventi'),

  // Fine
  emojiFine:      document.querySelector('#emoji-fine'),
  titoloFine:     document.querySelector('#titolo-fine'),
  testoFine:      document.querySelector('#testo-fine'),
  statPunteggio:  document.querySelector('#stat-punteggio'),
  statIndizi:     document.querySelector('#stat-indizi'),
  statVite:       document.querySelector('#stat-vite'),
  btnRicomincia:  document.querySelector('#btn-ricomincia'),
};

/** Aggiunge una riga al registro eventi */
const aggiungiLog = (testo, tipo = 'info') => {
  const riga = document.createElement('div');
  riga.className = `log-riga ${tipo}`;
  const ora = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  riga.textContent = `[${ora}] ${testo}`;
  el.logEventi.prepend(riga);
};

/** Aggiorna tutti i valori nell'header */
const aggiornaHeader = () => {
  el.nomeGiocatore.textContent = stato.nomeGiocatore;
  el.punteggio.textContent     = stato.punteggio;
  el.vite.textContent          = '❤️'.repeat(stato.vite);
  const rimasti = INDIZI.filter(i => !i.risolto).length;
  el.contatore.textContent     = rimasti;
};

/** Mostra una schermata, nasconde le altre */
const mostraSchermata = (id) => {
  document.querySelectorAll('.schermata').forEach(s => s.classList.remove('attiva'));
  document.querySelector(`#${id}`).classList.add('attiva');
};


//  MODULO 3 — Geolocation API
const ottieniPosizione = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation non supportata'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 8000,
    });
  });


//  Calcolo distanza (formula Haversine)
//  Restituisce la distanza in METRI tra due coordinate GPS
const calcolaDistanza = (lat1, lon1, lat2, lon2) => {
  const R    = 6371000; // raggio Terra in metri
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/** Formatta i metri in modo leggibile */
const formatDistanza = (metri) =>
  metri < 1000
    ? `${Math.round(metri)} m`
    : `${(metri / 1000).toFixed(1)} km`;

/** Percentuale di "vicinanza" per la barra (0–100) */
const calcolaPercentualeVicinanza = (distanza) => {
  const MAX = 2000; // da questa distanza parte la barra
  if (distanza <= 0) return 100;
  if (distanza >= MAX) return 0;
  return Math.round((1 - distanza / MAX) * 100);
};


//  LOGICA DI GIOCO

/** Carica e mostra l'indizio corrente */
const caricaIndizio = () => {
  const indizio = INDIZI[stato.indizioCorrente];

  el.badgeNumero.textContent  = `Indizio #${indizio.id}`;
  el.indizioPunti.textContent = `${indizio.punti} pt`;
  el.emojiIndizio.textContent = indizio.emoji;
  el.testoIndizio.textContent = indizio.testo;

  // Nascondi distanza e area risposta
  el.statoDistanza.classList.add('nascosto');
  el.areaSoluzione.classList.add('nascosta');
  el.inputRisposta.value      = '';
  el.feedbackRisp.textContent = '';
  el.feedbackRisp.className   = 'feedback';
  el.cardIndizio.classList.remove('vicino');
  el.barraDistanza.style.width = '0%';

  el.btnSonoQui.disabled      = false;
  el.btnSonoQui.textContent   = '📡 Sono qui!';

  aggiornaHeader();
  aggiungiLog(`Nuovo indizio sbloccato: "${indizio.testo.substring(0, 40)}..."`, 'info');
};

/** Chiamata quando il giocatore clicca "Sono qui!" */
const gestisciSonoQui = async () => {
  el.btnSonoQui.disabled    = true;
  el.btnSonoQui.textContent = '📡 Rilevamento GPS...';

  const indizio = INDIZI[stato.indizioCorrente];

  try {
    let distanza;

    if (stato.modalitaDemo) {
      // Modalità demo: simula avvicinamento progressivo
      distanza = Math.max(0, 80 + Math.random() * 40); // simula ~80-120m (entro raggio)
      aggiungiLog('Modalità demo: GPS simulato', 'info');
    } else {
      const posizione = await ottieniPosizione();
      const { latitude, longitude } = posizione.coords;
      distanza = calcolaDistanza(
        latitude, longitude,
        indizio.coordinate.lat, indizio.coordinate.lon
      );
      aggiungiLog(`Posizione rilevata — distanza: ${formatDistanza(distanza)}`, 'info');
    }

    // Mostra barra distanza
    el.statoDistanza.classList.remove('nascosto');
    const perc = calcolaPercentualeVicinanza(distanza);
    el.barraDistanza.style.width = `${perc}%`;

    if (distanza <= RAGGIO_VICINANZA) {
      // 🎉 Sei vicino!
      el.testoDistanza.textContent = `✅ Sei nel posto giusto! (${formatDistanza(distanza)})`;
      el.cardIndizio.classList.add('vicino');
      el.areaSoluzione.classList.remove('nascosta');
      el.inputRisposta.focus();
      aggiungiLog(`Sei vicino al punto! Inserisci la parola chiave`, 'successo');
    } else {
      // Troppo lontano
      el.testoDistanza.textContent = `Ancora lontano: ${formatDistanza(distanza)} dal punto`;
      aggiungiLog(`Troppo lontano (${formatDistanza(distanza)}). Avvicinati!`, 'errore');
      setTimeout(() => {
        el.btnSonoQui.disabled    = false;
        el.btnSonoQui.textContent = '📡 Riprova!';
      }, 2000);
    }

  } catch (err) {
    // GPS non disponibile → attiva modalità demo
    console.warn('GPS non disponibile:', err.message);
    stato.modalitaDemo = true;
    aggiungiLog('GPS non disponibile → Modalità DEMO attivata', 'info');

    el.statoDistanza.classList.remove('nascosto');
    el.barraDistanza.style.width = '85%';
    el.testoDistanza.textContent = '🎮 Modalità demo — GPS non disponibile';
    el.cardIndizio.classList.add('vicino');
    el.areaSoluzione.classList.remove('nascosta');
    el.inputRisposta.focus();
  }
};

/** Chiamata quando si invia la risposta */
const gestisciRisposta = () => {
  const risposta = el.inputRisposta.value;
  const indizio  = INDIZI[stato.indizioCorrente];

  if (!risposta.trim()) return;

  if (indizio.verifica(risposta)) {
    indizio.risolto  = true;
    stato.punteggio += indizio.punti;

    el.feedbackRisp.textContent = `✅ Corretto! +${indizio.punti} punti`;
    el.feedbackRisp.className   = 'feedback ok';
    el.btnInvia.disabled        = true;
    el.inputRisposta.disabled   = true;

    aggiungiLog(`Indizio #${indizio.id} risolto! +${indizio.punti} pt`, 'successo');
    aggiornaHeader();

    // Avanza al prossimo indizio dopo 1.5s
    setTimeout(() => {
      stato.indizioCorrente++;

      if (stato.indizioCorrente >= INDIZI.length) {
        terminaPartita(true);
      } else {
        caricaIndizio();
        el.btnInvia.disabled       = false;
        el.inputRisposta.disabled  = false;
      }
    }, 1500);

  } else {
    stato.vite--;
    el.feedbackRisp.textContent = `❌ Sbagliato! Vite rimaste: ${stato.vite}`;
    el.feedbackRisp.className   = 'feedback errore';
    el.inputRisposta.value      = '';

    aggiungiLog(`Risposta errata! Vite rimaste: ${stato.vite}`, 'errore');
    aggiornaHeader();

    if (stato.vite <= 0) {
      setTimeout(() => terminaPartita(false), 1000);
    } else {
      setTimeout(() => {
        el.feedbackRisp.textContent = '';
        el.inputRisposta.focus();
      }, 2000);
    }
  }
};

/** Termina la partita */
const terminaPartita = (vittoria) => {
  stato.partitaTerminata = true;
  const risolti = INDIZI.filter(i => i.risolto).length;

  if (vittoria) {
    el.emojiFine.textContent  = '🏆';
    el.titoloFine.textContent = 'Missione Completata!';
    el.testoFine.textContent  =
      `Complimenti ${stato.nomeGiocatore}! Hai trovato tutti i tesori e dimostrato di essere un vero esploratore!`;
  } else {
    el.emojiFine.textContent  = '💀';
    el.titoloFine.textContent = 'Game Over!';
    el.testoFine.textContent  =
      `Peccato ${stato.nomeGiocatore}! Hai esaurito le vite. Riprova — la caccia al tesoro ti aspetta!`;
  }

  el.statPunteggio.textContent = stato.punteggio;
  el.statIndizi.textContent    = risolti;
  el.statVite.textContent      = stato.vite;

  mostraSchermata('schermata-fine');
};

/** Resetta tutto e ricomincia */
const ricomincia = () => {
  stato.punteggio        = 0;
  stato.vite             = 3;
  stato.indizioCorrente  = 0;
  stato.partitaTerminata = false;
  stato.nomeGiocatore    = '';
  stato.modalitaDemo     = false;

  INDIZI.forEach(i => { i.risolto = false; });

  el.logEventi.innerHTML  = '';
  el.inputNome.value      = '';

  mostraSchermata('schermata-avvio');
};


// Bottone "Inizia l'avventura"
el.btnIniziaAvv.addEventListener('click', () => {
  const nome = el.inputNome.value.trim();
  if (!nome) {
    el.inputNome.focus();
    el.inputNome.style.borderColor = 'var(--colore-errore)';
    setTimeout(() => { el.inputNome.style.borderColor = ''; }, 1500);
    return;
  }
  stato.nomeGiocatore = nome;
  mostraSchermata('schermata-gioco');
  caricaIndizio();
});

// Invio nome con tasto Enter
el.inputNome.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') el.btnIniziaAvv.click();
});

// Bottone "Sono qui!"
el.btnSonoQui.addEventListener('click', gestisciSonoQui);

// Bottone "Invia risposta"
el.btnInvia.addEventListener('click', gestisciRisposta);

// Invio risposta con tasto Enter
el.inputRisposta.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') gestisciRisposta();
});

// Bottone "Ricomincia"
el.btnRicomincia.addEventListener('click', ricomincia);

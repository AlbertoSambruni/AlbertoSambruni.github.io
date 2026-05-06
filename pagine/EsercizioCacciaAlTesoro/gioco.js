// --- STATO DEL GIOCO
let nomeGiocatore = '';
let punteggio = 0;
let vite = 3;
let partitaTerminata = false;
let indizioCorrenteIdx = 0;
let modalitaNoGps = false; // Flag per la modalità senza coordinate

// --- CLASSE INDIZIO
class Indizio {
  constructor(testo, soluzione, punti, coordinate) {
    this.testo = testo;
    this.soluzione = soluzione;
    this.punti = punti;
    this.coordinate = coordinate; // { lat, lon }
    this.risolto = false;
  }

  verifica(risposta) {
    return risposta.trim().toUpperCase() === this.soluzione.toUpperCase();
  }
}

// --- DATABASE INDIZI
const indizi = [
  new Indizio('Cerca sotto la quercia nel parco.', 'QUERCIA', 50, { lat: 45.4654, lon: 9.1859 }),
  new Indizio('Vicino alla vecchia fontana.', 'FONTANA', 100, { lat: 45.4700, lon: 9.1900 }),
  new Indizio('Dove il muro diventa rosso.', 'MURO', 150, { lat: 45.4750, lon: 9.1950 })
];

// --- LOGICA DI SUPPORTO

const logEvento = (messaggio) => {
  const logDiv = document.querySelector('#log-eventi');
  const riga = document.createElement('p');
  riga.textContent = `[${new Date().toLocaleTimeString()}] ${messaggio}`;
  logDiv.prepend(riga); // Aggiunge in alto per visibilità
};

const guadagnaPunti = (puntiAttuali, daAggiungere, moltiplicatore = 1) => {
  return puntiAttuali + (daAggiungere * moltiplicatore);
};

const calcolaPuntiDisponibili = () => {
  return indizi
    .filter(i => !i.risolto)
    .reduce((acc, curr) => acc + curr.punti, 0);
};

const calcolaDistanza = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Raggio Terra in metri
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- LOGICA ASINCRONA E GPS

const attendi = (ms) => new Promise(res => setTimeout(res, ms));

const ottieniPosizione = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject("GPS non supportato");
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
  });
};

const gestisciSonoQui = async () => {
  if (partitaTerminata) return;

  const btn = document.querySelector('#btn-sono-qui');
  const feedback = document.querySelector('#feedback');
  btn.disabled = true;
  feedback.textContent = "Ricerca segnale GPS in corso...";

  try {
    if (modalitaNoGps) throw new Error("Modalità manuale attiva");

    const pos = await ottieniPosizione();
    const indizio = indizi[indizioCorrenteIdx];
    const dist = calcolaDistanza(pos.coords.latitude, pos.coords.longitude, indizio.coordinate.lat, indizio.coordinate.lon);

    document.querySelector('#testo-distanza').textContent = `Distanza: ${Math.round(dist)} metri`;

    if (dist < 50) { // Sei entro 50 metri
      logEvento("Sei arrivato a destinazione!");
      document.querySelector('#area-risposta').classList.remove('nascosto');
      feedback.textContent = "Ottimo! Ora inserisci la parola chiave.";
    } else {
      feedback.textContent = "Sei ancora troppo lontano!";
    }
  } catch (error) {
    console.warn("Passaggio a modalità No GPS:", error);
    if (!modalitaNoGps) {
      modalitaNoGps = true;
      logEvento("GPS non disponibile. Modalità 'No GPS' attivata.");
    }
    feedback.textContent = "Modalità manuale: inserisci la risposta.";
    document.querySelector('#area-risposta').classList.remove('nascosto');
    document.querySelector('#testo-distanza').textContent = "Distanza non disponibile (No GPS)";
  } finally {
    btn.disabled = false;
  }
};

// --- GESTIONE INTERFACCIA

const aggiornaInterfaccia = () => {
  document.querySelector('#nome-giocatore').textContent = nomeGiocatore;
  document.querySelector('#punteggio').textContent = punteggio;
  document.querySelector('#vite').textContent = vite;
};

const mostraIndizio = () => {
  const indizio = indizi[indizioCorrenteIdx];
  if (indizio) {
    document.querySelector('#testo-indizio').textContent = indizio.testo;
    document.querySelector('#area-risposta').classList.add('nascosto');
    document.querySelector('#input-risposta').value = '';
    logEvento(`Nuovo indizio: ${indizio.testo.substring(0, 20)}...`);
  }
};

const gestisciRisposta = () => {
  const input = document.querySelector('#input-risposta');
  const risposta = input.value;
  const indizio = indizi[indizioCorrenteIdx];

  if (indizio.verifica(risposta)) {
    indizio.risolto = true;
    punteggio = guadagnaPunti(punteggio, indizio.punti);
    logEvento(`Corretto! Guadagnati ${indizio.punti} punti.`);
    
    indizioCorrenteIdx++;
    if (indizioCorrenteIdx < indizi.length) {
      aggiornaInterfaccia();
      mostraIndizio();
    } else {
      terminaPartita("Hai trovato tutti i tesori!");
    }
  } else {
    vite--;
    logEvento(`Risposta errata! Vite rimaste: ${vite}`);
    if (vite <= 0) {
      terminaPartita("Hai esaurito le vite!");
    }
  }
  aggiornaInterfaccia();
};

const terminaPartita = (messaggio) => {
  partitaTerminata = true;
  document.querySelector('#sezione-gioco').classList.add('nascosto');
  document.querySelector('#sezione-fine').classList.remove('nascosto');
  document.querySelector('#messaggio-fine').textContent = messaggio;
  document.querySelector('#punteggio-finale').textContent = punteggio;
  
  const disponibili = calcolaPuntiDisponibili();
  logEvento(`Fine partita. Punti persi per strada: ${disponibili}`);
};

// --- EVENT LISTENERS

document.querySelector('#btn-inizia').addEventListener('click', () => {
  const inputNome = document.querySelector('#input-nome');
  nomeGiocatore = inputNome.value.trim() || 'Esploratore';
  
  document.querySelector('#sezione-avvio').classList.add('nascosto');
  document.querySelector('#sezione-gioco').classList.remove('nascosto');
  
  aggiornaInterfaccia();
  mostraIndizio();
  logEvento("Partita avviata.");
});

document.querySelector('#btn-sono-qui').addEventListener('click', gestisciSonoQui);
document.querySelector('#btn-invia').addEventListener('click', gestisciRisposta);

document.querySelector('#btn-ricomincia').addEventListener('click', () => {
  location.reload(); // Il modo più semplice per resettare tutto lo stato
});
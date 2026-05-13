const studenti = [];

function aggiungiStudente() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const eta = document.getElementById('eta').value.trim();
  const errore = document.getElementById('errore');

  if (!nome || !cognome || !eta) {
    errore.classList.remove('d-none');
    return;
  }
  if(eta < 0){
    alert("Non puoi inserire età negative");
    mostraStudenti();
    return;
  }

  errore.classList.add('d-none');

  studenti.push({ nome, cognome, eta });

  document.getElementById('nome').value = '';
  document.getElementById('cognome').value = '';
  document.getElementById('eta').value = '';

  mostraStudenti();
}

function mostraStudenti() {
  const tbody = document.getElementById('tabellaBody');
  const vuoto = document.getElementById('vuoto');
  tbody.innerHTML = '';

  if (studenti.length === 0) {
    vuoto.style.display = 'block';
    return;
  }
  vuoto.style.display = 'none';

  studenti.forEach((s, indice) => {
    const riga = document.createElement('tr');
    riga.innerHTML = `
      <td>${s.nome}</td>
      <td>${s.cognome}</td>
      <td>${s.eta}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminaStudente(${indice})">Elimina</button>
      </td>
    `;
    tbody.appendChild(riga);
  });
}

function eliminaStudente(indice) {
  studenti.splice(indice, 1);
  mostraStudenti();
}
mostraStudenti();
function registrati() {
    // 1. Recupero valori dai campi di testo, email e data
    const cognome = document.getElementById('cognome').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const dataNascita = document.getElementById('dataNascita').value;

    // 2. Recupero valore dal Radio Button (bisogna cercare quello selezionato)
    const sesso = document.querySelector('input[name="sesso"]:checked').value;

    // 3. Recupero valore dal menu a tendina Select
    const provincia = document.getElementById('provincia').value;

    // 4. Recupero valore numerico dal Range
    const livello = document.getElementById('livello').value;

    // 5. Recupero valore booleano (true/false) dalla Checkbox
    const accettaContratto = document.getElementById('contratto').checked;

    // Logica di controllo semplice
    if (!accettaContratto) {
        document.getElementById('messaggio').innerHTML = 
            "<span style='color: red;'>Errore: Devi accettare i termini!</span>";
        return;
    }

    // Output dei risultati nel div 'messaggio'
    const output = `
        <h3>Dati Ricevuti:</h3>
        <b>Utente:</b> ${nome} ${cognome}
        <b>Email:</b> ${email}
        <b>Nato il:</b> ${dataNascita}
        <b>Sesso:</b> ${sesso}
        <b>Provincia:</b> ${provincia}
        <b>Livello:</b> ${livello}/10
    `;

    document.getElementById('messaggio').innerHTML = output;
    
    // Mostra anche i dati in console per debug
    console.log("Dati inviati:", { nome, cognome, email, sesso, accettaContratto });
}
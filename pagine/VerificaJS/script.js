function setCookie(nome, valore, giorni){
    let data = new Date();
    data.setTime(data.getTime() + (giorni * 24 * 60 * 60 * 1000));
    document.cookie = nome + "=" + encodeURIComponent(valore) + ";expires=" + data.toUTCString() + ";path=/";
}

function getCookie(nome){
    let cookies = document.cookie.split(";");
    for(let i = 0; i < cookies.length; i++){
        let c = cookies[i].trim();
        if(c.startsWith(nome+"="))
            return decodeURIComponent(c.substring(nome.length+1));
    }
    return "";
}

function carica1(){
    let nome = document.getElementById("nome").value;
    let cognome = document.getElementById("cognome").value;

    for(let i = 0; i < nome.length; i++){
        if(!isNaN(nome[i])){
            alert("Inserisci un nome valido!");
            return;
        }
    }
    for(let i = 0; i < cognome.length; i++){
        if(!isNaN(cognome[i])){
            alert("Inserisci un nome valido!");
            return;
        }
    }
    if(nome.length < 3){
        alert("inserisci un nome di corretta lunghezza!")
        return;
    }
    if(cognome.length < 3){
        alert("inserisci un cognome di corretta lunghezza!")
        return;
    }

    if(nome[0].toUpperCase() !== nome[0]){
        alert("Inserisci nome con lettera maiuscola!")
        return;
    }
    if(cognome[0].toUpperCase() !== cognome[0]){
        alert("Inserisci cognome con lettera maiuscola!")
        return;
    }
    setCookie("nome", nome, 1);
    setCookie("cognome", cognome, 1);

    window.location.href = "pagina2.html";
}

function caricaPag2(){
    const citta = ["Milano", "Bergamo", "Brescia", "Como", "Cremona", "Lecco", "Lodi", "Mantova", "Monza", "Pavia", "Sondrio", "Varese"];
    let s = `Partenza: <select id="partenza">`;
    for(let i = 0; i < citta.length; i++){
        s+= `<option>${citta[i]}</option>`;
    }
    s +="</select>";

    s += `Destinazione: <select id="destinazione">`;
    for(let i = 0; i < citta.length; i++){
        s+= `<option>${citta[i]}</option>`;
    }
    s +="</select>";
    document.getElementById("paginaCreata").innerHTML = s;
}

function carica2(){
    let partenza = document.getElementById("partenza").value;
    let destinazione = document.getElementById("destinazione").value;

    if(partenza === destinazione){
        alert("Inserisci due località diverse!");
        return;
    }

    setCookie("partenza", partenza, 1);
    setCookie("destinazione", destinazione, 1);

    window.location.href = "pagina3.html";
}

function caricaPag3(){
    const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggiol", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    let a = `<select id="mese">`;
    for(let i = 0; i < mesi.length; i++){
        a+= `<option>${mesi[i]}</option>`;
    }
    a +="</select>";

    document.getElementById("stampaMese").innerHTML = a;
}

function carica3(){
    const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggiol", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    let giorno = document.getElementById("giorno").value;
    let meseNome = document.getElementById("mese").value;
    let anno = document.getElementById("anno").value;
    let giornoDiOggi = new Date().getDate();
    let meseDiOggi = new Date().getMonth() + 1;
    let annoDiOggi = new Date().getFullYear();
    let mese = 0;

    if(isNaN(giorno) || isNaN(anno)){
        alert("inserisci dei valori numerici!")
        return;
    }

    if(giorno <= 0){
        alert("inserisci un giorno corretto");
        return;
    }

    for(let i = 0; i < mesi.length; i++){
        if(meseNome === mesi[i]){
            mese = i+1;
            console.log(mese);
        }
    }

    //controllo Mesi e giorni
    if(mese === 0){
        alert("mese non inserito correttamente");
        return;
    }

    if(mese === 2 && giorno > 28){ //Febbraio
        alert("febbraio ha massimo 28 giorni");
        return;
    }
    if(mese === 11 || mese === 4 || mese === 6 || mese === 9){ //mesi con 30 giorni
        if(giorno > 30){
            alert("questo mese ha 30 giorni");
            return;
        }
    }else{
        if(giorno > 31){
            alert("questo mese ha 31 giorni");
            return;
        }
    }

    if(anno < annoDiOggi){
        alert("Anno non valido!");
        return;
    }else{
        if(anno > annoDiOggi){//controllo da dicembre a gennaio 
            if(anno === annoDiOggi+1 && meseDiOggi === 12 && mese === 1){

            }else{
                alert("Anno non valido!");
                return;
            }
        }
    }

    //controllo mese o mese+1
    if(mese === (meseDiOggi+1) || mese === meseDiOggi){        
        if(giorno >= giornoDiOggi){
            setCookie("giorno", giorno, 1);
            setCookie("mese", mese, 1);
            setCookie("anno", anno, 1);
            window.location.href = "pagina4.html";
        }else{
            alert("Il viaggio deve rientrare in un mese dall'acquisto del biglietto!");
            return;
        }
    }else{
        alert("Il viaggio deve rientrare in un mese dall'acquisto del biglietto!");
        return;
    }
}

function caricaPag4(){
    let s = "";
    s += `<p>Nome e Cognome: ${getCookie("nome")} ${getCookie("cognome")} </p> <br>`;
    s += `<p>Città di partenza: ${getCookie("partenza")}</p> <br>`;
    s += `<p>Città di destinazione:  ${getCookie("destinazione")}</p> <br>`;
    s += `<p>Data viaggio:  ${getCookie("giorno")}/${getCookie("mese")}/${getCookie("anno")}</p> <br>`;
    document.getElementById("riepilogo").innerHTML = s;
}

function tornaIndietro(){
    window.location.href = "pagina1.html";

}
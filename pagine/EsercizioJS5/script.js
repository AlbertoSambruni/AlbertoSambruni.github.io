document.addEventListener("DOMContentLoaded", function() {
    let selectAnno = document.getElementById("annoNascita");
    let annoCorrente = new Date().getFullYear();

    let html = "";
    for (let i = 1900; i <= annoCorrente - 18; i++) {
        html += "<option value=" + i + ">" + i + "</option>";
    }
    selectAnno.innerHTML = html;
});

function registrati() {
    let nome = document.getElementById("nome").value;
    let cognome = document.getElementById("cognome").value;
    let contratto = document.getElementById("contratto").checked;
    
    let radios = document.getElementsByName("sesso");
    let sessoSelezionato = "";

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            sessoSelezionato = radios[i].id; 
        }
    }

    if (contratto == false) {
    } else {
        let titolo = "";
        if (sessoSelezionato == "sessoM") {
            titolo = "sig.";
        } else {
            titolo = "sig.ra";
        }

        let msg = "Gentile " + titolo + " " + cognome + " " + nome + ", la ringraziamo per la registrazione.";
        document.getElementById("messaggio").innerHTML = msg;
    }
}
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

var articoli = [
    {
        nome: "mouse",
        prezzo: 16.00
    },
    {
        nome: "tastiera",
        prezzo: 25.00
    },
    {
        nome: "stampante",
        prezzo: 350.00
    }
];

function caricaTabella() {   
    let s = `
        <table>
            <thead>
                <tr>
                    <th>Q.ta</th>
                    <th>Descrizione</th>
                    <th>Costo Unitario</th>
                    <th>Totale</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="number" id="qta1" value="0"></td>
                    <td>${articoli[0].nome}</td>
                    <td>${articoli[0].prezzo}€</td>
                    <td><p id="tot1">0</p></td>
                </tr>
                <tr>
                    <td><input type="number" id="qta2" value="0"></td>
                    <td>${articoli[1].nome}</td>
                    <td>${articoli[1].prezzo}€</td>
                    <td><p id="tot2">0</p></td>
                </tr>
                <tr>
                    <td><input type="number" id="qta3" value="0"></td>
                    <td>${articoli[2].nome}</td>
                    <td>${articoli[2].prezzo}€</td>
                    <td><p id="tot3">0</p></td>
                </tr>
                </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <button onclick="calcolaTotale()">TOTALE ORDINE</button>
                    </td>
                    <td><p id="totaleFinale">0</p></td>
                </tr>
            </tfoot>
        </table>`;

    document.getElementById("carica").innerHTML = s;
}

function calcolaTotale(){
    let qta1 = document.getElementById("qta1").value;
    let qta2 = document.getElementById("qta2").value;
    let qta3 = document.getElementById("qta3").value;

    if(qta1 < 0 || qta1 > 20 || qta2 < 0 || qta2 > 20 || qta3 < 0 || qta3 > 20){
        alert("inserisci quantità corrette");

        return;
    }
    let tot1 = qta1*articoli[0].prezzo;
    let tot2 = qta2*articoli[1].prezzo;
    let tot3 = qta3*articoli[2].prezzo;

    let totFin = tot1+tot2+tot3;

    document.getElementById("tot1").innerHTML = tot1;
    document.getElementById("tot2").innerHTML = tot2;
    document.getElementById("tot3").innerHTML = tot3;
    document.getElementById("totaleFinale").innerHTML = totFin;
}

function azzeraModulo(){
    document.getElementById("qta1").value = 0;
    document.getElementById("qta2").value = 0;
    document.getElementById("qta3").value = 0;
    document.getElementById("tot1").innerHTML = 0;
    document.getElementById("tot2").innerHTML = 0;
    document.getElementById("tot3").innerHTML = 0;
    document.getElementById("totaleFinale").innerText = 0;
}

function inviaOrdine(){
    let email = document.getElementById("email").value;
    let checkChio = false;
    let pagamento = document.getElementById("pagamento").value;

    if(!isNaN(email[0])){
        alert("Il primo carattere non può essere un numero");
        return;
    }
    for(let i = 0; i < email.length; i++){
        if(email[i] === "@"){
            checkChio = true;
            continue;
        }
        if(checkChio === true){
            if(!isNaN(email[i])){
                alert("Non si possono avere numeri nel dominio");
                return;
            }
        }
    }
    if(checkChio === false){
        alert("inserisci un dominio con @");
        return;
    }
    document.getElementById("pagamento").value;

    document.getElementById("finale").innerHTML = `<p> Grazie per il suo ordine di ${document.getElementById("totaleFinale").innerText}€, il pagamento avverrà
        tramite ${pagamento}. Riceverà notifiche all’indirizzo ${email} </p>`;
}

function inviaOrdineNewPag(){
    let email = document.getElementById("email").value;
    let checkChio = false;
    let pagamento = document.getElementById("pagamento").value;

    if(!isNaN(email[0])){
        alert("Il primo carattere non può essere un numero");
        return;
    }
    for(let i = 0; i < email.length; i++){
        if(email[i] === "@"){
            checkChio = true;
            continue;
        }
        if(checkChio === true){
            if(!isNaN(email[i])){
                alert("Non si possono avere numeri nel dominio");
                return;
            }
        }
    }
    if(checkChio === false){
        alert("inserisci un dominio con @");
        return;
    }
    document.getElementById("pagamento").value;

    setCookie("email", email, 1);
    setCookie("pagamento", pagamento, 1);
    setCookie("tot", document.getElementById("totaleFinale").innerText, 1);

    window.location.href = "pagina2.html";
}

function carica(){
    email = getCookie("email");
    pagamento = getCookie("pagamento");
    tot = getCookie("tot");

    document.getElementById("riepilogo").innerHTML = `<p> Grazie per il suo ordine di ${tot}€, il pagamento avverrà
        tramite ${pagamento}. Riceverà notifiche all’indirizzo ${email} </p>`;
}
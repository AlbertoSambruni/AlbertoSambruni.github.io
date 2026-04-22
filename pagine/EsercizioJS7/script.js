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

function salvaDati1(){
    let risposta1 = document.getElementById("risposta1").value;
    setCookie("risposta1", risposta1, 1);
    window.location.href = "pagina2.html";
}
function salvaDati2(){
    let valori2 = document.getElementById("valori2").value;
    setCookie("valori2", valori2, 1);
    window.location.href = "pagina3.html";
}
function salvaDati3(){
    let radios = document.getElementsByName("domanda3");
    let selezione = "";

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selezione = radios[i].id; 
        }
    }

    setCookie("risposta3", selezione, 1);
    window.location.href = "pagina4.html";
}
function salvaDati4(){
    let void_val = document.getElementById("void_val").checked;
    let integer_val = document.getElementById("integer_val").checked;
    let char_val = document.getElementById("char_val").checked;

    setCookie("risposta4_1", void_val, 1);
    setCookie("risposta4_2", integer_val, 1);
    setCookie("risposta4_3", char_val, 1);
    window.location.href = "pagina5.html";
}
function salvaDati5(){
    let risposta5 = document.getElementById("risposta5").value;
    setCookie("risposta5", risposta5, 1);
    window.location.href = "paginaFinale.html";
}


function caricaRiepilogo(){
    let s="";
    let punti = 0;
    let risposta1 = getCookie("risposta1");
    let valori2 = getCookie("valori2");
    let risposta3 = getCookie("risposta3");
    let risposta4_1 = getCookie("risposta4_1");
    let risposta4_2 = getCookie("risposta4_2");
    let risposta4_3 = getCookie("risposta4_3");
    let risposta5 = getCookie("risposta5");

    //Risposta 1
    if(risposta1 == "SQL"){
        s+="Risposta 1: Corretta";
        s+= "<br>";
        punti++;
    }else{
        s+="Risposta 1: Sbagliata";
        s+= "<br>";
    }
    //Risposta 2
    if(valori2 == 2){
        s+="Risposta 2: Corretta";
        s+= "<br>";
        punti++;
    }else{
        s+="Risposta 2: Sbagliata";
        s+= "<br>";
    }
    //Risposta 3
    if(risposta3.value == "selezione"){
        s+="Risposta 3: Corretta";
        s+= "<br>";
        punti++;
    }else{
        s+="Risposta 3: Sbagliata";
        s+= "<br>";
    }
    //Risposta 4
    if(risposta4_1 == false){
        s+="Risposta 3 (void): Corretta";
        s+= "<br>";
        punti++;
    }else{
        s+="Risposta 3 (void): Sbagliata";
        s+= "<br>";
    }
    if(risposta4_2 == false){
        s+="Risposta 3 (integer): Sbagliata";
        s+= "<br>";
    }else{
        s+="Risposta 3 (integer): Corretta";
        s+= "<br>";
        punti++;
    }
    if(risposta4_3 == false){
        s+="Risposta 3 (char): Corretta";
        s+= "<br>";
        punti++;
    }else{
        s+="Risposta 3 (char): Sbagliata";
        s+= "<br>";
    }
    //Risposta 1
    if(risposta5 == "BYTE"){
        s+="Risposta 5: Corretta";
        s+= "<br>";
        punti++;
    }else{
        s+="Risposta 5: Sbagliata";
        s+= "<br>";
    }
    s+="<h3> punti: " + punti +"</h3>";
    document.getElementById("riepilogo").innerHTML = s;
}
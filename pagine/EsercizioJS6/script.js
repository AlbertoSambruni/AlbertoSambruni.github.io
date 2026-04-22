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

function salvaDati(){
    let nome = document.getElementById("nome").value;
    let cognome = document.getElementById("cognome").value;
    setCookie("nome", nome, 1);
    setCookie("cognome", cognome, 1);
    window.location.href = "pagina2.html";

}

function caricaRiepilogo(){
    let nome = getCookie("nome");
    let cognome = getCookie("cognome");
    let s="";
    s+= "Nome: " + nome;
    s+= "<br>";
    s+= "Cognome: " + cognome;
    document.getElementById("riepilogo").innerHTML = s;
}
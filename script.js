function generaElenco(){
    let s = "";
    s+="<ul>";
    for(let i=0; i<3;i++){
        s+="<li>Item Numero: " + i + "</li>";
    }
    s+="</ul>";
    console.log(s);
}
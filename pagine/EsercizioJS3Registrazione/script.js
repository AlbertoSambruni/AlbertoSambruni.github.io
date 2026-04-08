document.addEventListener("DOMContentLoaded", function(){
    const hobbies = document.querySelectorAll(".hobby"); 
    const radios = document.getElementsByName("sesso");

    for(let i=0; i<hobbies.length; i++){
        hobbies[i].addEventListener("change", stampa);
    }
    
    for(let i=0; i<radios.length; i++){
        radios[i].addEventListener("change", stampa);
    }

    function stampa(){
        let selezionati = [];
        for(let i=0; i<hobbies.length; i++){
            if(hobbies[i].checked){
                selezionati.push(hobbies[i].value);
            }
        }
        
        let sessoSelezionato = "";
        for(let i=0; i<radios.length; i++){
            if(radios[i].checked){
                sessoSelezionato = radios[i].value;
            }
        }

        console.log("Hobbies: ", selezionati);
        console.log("Sesso: ", sessoSelezionato);
    }
});
function generaTavola(){
	let s="";
	for(let i=1;i<=10;i++){
		s+="<tr>";
		for(let j=1;j<=10;j++){
			if(i*j%2==0)
				s+="<td class='pari'>"+i*j+"</td>";
			else
				s+="<td class='dispari'>"+i*j+"</td>";
		}
		s+="</tr>";
	}
	return s;
}

const tav = document.getElementById("tavola");
tav.innerHTML = generaTavola();
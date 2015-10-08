/* fem una funció que s'encarregui de demanar per pantalla les dades i de guardarles en
 * un objecte anomenat CampDeMines*/
function condicionsinicials(){
	var h, l, n, i, j, acceptar;
	do{
		h=Math.floor(Number(prompt("introdueix l'alcada del buscaminas","16")));
		if (h<4){
			alert("quina merda de camp torna-ho a intentar.");
			acceptar=1;
		}
		else if (h>99){
			alert("t'has passat tio.");
			acceptar=1;
		}
		else{
			acceptar=0;
		}
	}
	while (acceptar==1);
	do{
		l=prompt("introdueix l'amplada del buscaminas","16");
		l=Math.floor(l);
		if (l<4){
			alert("quina merda de camp torna-ho a intentar.");
			acceptar=1;
		}
		else if (l>99){
			alert("t'has passat tio.");
			acceptar=1;
		}
		else{
			acceptar=0;
		}
	}
	while (acceptar==1);
	do{
		n=Math.floor(Number(prompt("introdueix el nombre de mines",""+Math.floor(l*h/6))));
		if (n<1){
			alert("nenaza posa'l mes alt.");
			acceptar=1;
		}
		else if (n>l*h-10){
			alert("t'has passat tio.");
			acceptar=1;
		}
		else{
			acceptar=0;
		}
	}
	while (acceptar==1);
	CampDeMines=new Object();
	CampDeMines.alcada=h;
	CampDeMines.llargada=l;
	CampDeMines.mines=n;
	CampDeMines.segur=h*l-n;
	CampDeMines.camp=[];
	for (i=0; i<l*h; i++){
		CampDeMines.camp.push(0);
	}
}

/* fem una funció que mostri per pantalla una serie de botons que s'assemblin al camp
 * del buscamines pero que no tinguin cap mina dins*/
function posarcamp(){
	var h, l, i, j, text, n;
	h=CampDeMines.alcada;
	l=CampDeMines.llargada;
	text="<center>\n";
	for (i=0; i<h; i++){
		for (j=0; j<l; j++){
			n=l*i+j;
			text=text+'<input class="btn" type="button" name="boto'+n+'" id="boto'+n+'" value="&nbsp" oncontextmenu="javascript:botodret('+n+'); return false;" onClick="posarmines('+n+')"> \n';
		}
		text=text+'<br> \n';
	}
	text=text+"</center>\n";
	document.getElementById("BuscaMines").innerHTML=text;
	for (i=0; i<h; i++){
		for (j=0; j<l; j++){
			n=l*i+j;
			BuscaMines["boto"+n].segur="n";
			BuscaMines["boto"+n].clicat="n";
		}
	}
}

/* fem una funció que una vegada fet click en una casella ompli el buscamines de
 *  manera que no hi hagi cap mina al voltant d'aquesta casella*/
function posarmines(casella){
	var h, l, x, y, i, j, llista=[];
	h=CampDeMines.alcada;
	l=CampDeMines.llargada;
	x=casella%l;
	y=Math.floor(casella/l);
	for (j=0; j<h; j++){
		for (i=0; i<l; i++){
			llista.push(j*l+i);
			if (i==x-1 || i==x || i==x+1 ){
				if (j==y-1 || j==y || j==y+1){
					llista.pop();
				}
			}
		}
	}
	x=CampDeMines.mines;
	while (x>0){
		y=Math.floor(Math.random()*llista.length);
		i=llista[y];
		CampDeMines.camp[i]="b";
		if (y==llista.length-1){
			llista.pop();
		}
		else{
			llista[y]=llista.pop();
		}
		x--;
	}
	posarnumeros();
	ferclick(casella);
}

/* fem ara una funció que miri on es troben les mines "b" en el atribut camp del 
 * objecte CampDeMines i en cada casella escrigui el nombre de mines que l'envolten*/
function posarnumeros(){
	var x, y, i, j, l, h;
	h=CampDeMines.alcada;
	l=CampDeMines.llargada;
	for (y=0; y<h; y++){
		for (x=0; x<l; x++){
			if (CampDeMines.camp[l*y+x]=="b"){
				for (i=y-1; i<=y+1; i++){
					for (j=x-1; j<=x+1; j++){
						if (i>=0 && i<h && j>=0 && j<l && CampDeMines.camp[l*i+j]!="b"){
							CampDeMines.camp[l*i+j]++;
						}
					}
				}
			}
		}
	}
	cambiaronclick(0);
}

/* fem una funció que s'activi després d'haver fet click sobre la primera casella i
 * que modifiqui l'acció a complir cuan es faci click la primera vegada (s=0) i cuan
 * s'acabi el joc (s=1)*/
function cambiaronclick(s){
	var i, max;
	max=CampDeMines.alcada;
	max=max*CampDeMines.llargada;
	if (s==0){
		for (i=0; i<max; i++){
			BuscaMines["boto"+i].setAttribute("onClick", "ferclick("+i+")");
		}
	}
	if (s==1){
		for (i=0; i<max; i++){
			BuscaMines["boto"+i].removeAttribute("onClick");
			BuscaMines["boto"+i].removeAttribute("oncontextmenu");
		}
	}
}

/* fem una funcio que s'activi al fer click sobre una casella i mostri que hi ha a sota*/
function ferclick(casella){
	var n, max;
	max=CampDeMines.alcada;
	max=max*CampDeMines.llargada;
	n=CampDeMines.camp[casella];
	if (n==0){
		BuscaMines["boto"+casella].value="   ";
	}
	else{
		BuscaMines["boto"+casella].value=n;
	}
	BuscaMines["boto"+casella].clicat="s";
	BuscaMines["boto"+casella].style.backgroundColor='#a9a9a9';
	posarcolor(casella);
	if (n=="b"){
		for (i=0; i<max; i++){
			if (CampDeMines.camp[i]=="b"){
				BuscaMines["boto"+i].value="b";
			}
		}
		cambiaronclick(1);
		alert("BOOOOOOM");
	}
	else if (n==0){
		var x, y, i, j, h, l, m;
		l=CampDeMines.llargada;
		h=CampDeMines.alcada;
		x=casella%l;
		y=Math.floor(casella/l);
		for (i=y-1; i<=y+1; i++){
			for (j=x-1; j<=x+1; j++){
				if (i>=0 && i<h && j>=0 && j<l){
					m=l*i+j;
					if (document.BuscaMines["boto"+m].clicat=="n"){
						ferclick(m);
					}
				}
			}
		}
		CampDeMines.segur--;
	}
	else{
		CampDeMines.segur--;
	}
	if (CampDeMines.segur==0){
		alert("MOOOOOOOOOOOOLT BEEEEEEEE.\nHas guanyat.");
		cambiaronclick(1);
	}
}

/* fem una funció que depenent del valor de la casella posi el text de un determinat color o de un altre*/
function posarcolor(casella){
	var numero;
	numero=CampDeMines.camp[casella];
	if (numero=="b"){
		BuscaMines["boto"+casella].style.color='#000000';
	}
	if (numero=="1"){
		BuscaMines["boto"+casella].style.color='#0000ff';
	}
	if (numero=="2"){
		BuscaMines["boto"+casella].style.color='#008000';
	}
	if (numero=="3"){
		BuscaMines["boto"+casella].style.color='#ff0000';
	}
	if (numero=="4"){
		BuscaMines["boto"+casella].style.color='#000080';
	}
	if (numero=="5"){
		BuscaMines["boto"+casella].style.color='#8b0000';
	}
	if (numero=="6"){
		BuscaMines["boto"+casella].style.color='#1e90ff';
	}
	if (numero=="7"){
		BuscaMines["boto"+casella].style.color='#000000';
	}
	if (numero=="8"){
		BuscaMines["boto"+casella].style.color='#c0c0c0';
	}
	if (numero=="9"){
		BuscaMines["boto"+casella].style.color='#000000';
	}
}

/* fem una funció per marcar una casella com a segura i evitar que es faci click a sobre 
 * per error*/
function asegurar(casella){
	if (BuscaMines["boto"+casella].segur=="n"){
		BuscaMines["boto"+casella].style.backgroundColor='red';
		BuscaMines["boto"+casella].segur="s";
		BuscaMines["boto"+casella].removeAttribute("onClick");
	}
	else if (BuscaMines["boto"+casella].segur=="s"){
		BuscaMines["boto"+casella].style.backgroundColor='';
		BuscaMines["boto"+casella].segur="ns/nc";
		BuscaMines["boto"+casella].value="?";
	}
	else{
		BuscaMines["boto"+casella].segur="n";
		BuscaMines["boto"+casella].value="   ";
		BuscaMines["boto"+casella].setAttribute("onClick", "ferclick("+casella+")");
	}
}

/* fem una funció que permeti fer click a totes les caselles no segures al voltant de una
 * determinada casella */
function clickvoltant (casella){
	var x, y, i, j, h, l, n, segurs=0;
	l=CampDeMines.llargada;
	h=CampDeMines.alcada;
	x=casella%l;
	y=Math.floor(casella/l);
	for (i=y-1; i<=y+1; i++){
		for (j=x-1; j<=x+1; j++){
			n=l*i+j;
			if (i>=0 && j>=0 && i<h && j<l && BuscaMines["boto"+n].clicat=="n" && BuscaMines["boto"+n].segur=="s"){
				segurs++;
			}
		}
	}
	if (segurs>= CampDeMines.camp[casella]){
		for (i=y-1; i<=y+1; i++){
			for (j=x-1; j<=x+1; j++){
				if (i>=0 && i<h && j>=0 && j<l){
					n=l*i+j;
					if (i>=0 && j>=0 && i<h && j<l && BuscaMines["boto"+n].segur=="n" && BuscaMines["boto"+n].clicat=="n"){
						ferclick(n);
					}
				}
			}
		}
	}
}

/* fem una funció que detecti quin botó s'ha clicat i activi una o un'altra funció segons
 * aquesta informació */
function botodret(casella) {
	if (BuscaMines["boto"+casella].clicat=="s"){
		clickvoltant(casella);
	}
	else if (BuscaMines["boto"+casella].clicat=="n"){
		asegurar(casella);
	}
	return false;
}
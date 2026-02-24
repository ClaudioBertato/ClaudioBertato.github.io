class Turtle {
    canvas= document.querySelector("#canvas");
    ctx= document.querySelector("#canvas").getContext('2d');
    x= 650;
    y= 200; 
    angolo= 0; 
    colore= "blue";
    pennello= true;


    setAngolo(angolo){
        this.angolo = angolo;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    getAngolo(){
        return this.angolo;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y
    }

    avanti(p) {
        let aRad = this.angolo * (Math.PI / 180); //trova l'angolo inradianti a partire dall'angolo in gradi
        let x1 = this.x + (p * Math.cos(aRad)); //Calcola la nuova cordinata x 
        let y1 = this.y + (p * Math.sin(aRad)); //Calcola la nuova cordinata y
       
        this.ctx.beginPath(); 
        this.ctx.strokeStyle = this.colore;
        this.ctx.moveTo(this.x, this.y);

        if (this.pennello) { //Se il pennello è abbassato allora fa la linea
            this.ctx.lineTo(x1, y1);
            this.ctx.stroke();
        }

        this.x = x1;
        this.y = y1;
    }

    ruota(a) {
        this.angolo = (this.angolo + a) % 360; //Aggiorna l'angolo
                                          //Permette di avere sempre angoli compresi tra 0 e 359 gradi
        
        
    }

    alza() {
        this.pennello = false;
    }

    abbassa() {
        this.pennello = true;
    }

    setColore(c) {
        this.colore = c;    
    }
}

myTurtle = new Turtle();
let l = 600; //Lato da disegnare
let n = 5;




function vonKoch(n, l) {
    if (n === 0) { //caso base che finisce se n=0 e disegna una linea
        myTurtle.avanti(l);
    } else {
        vonKoch(n - 1, l / 3); //disegna il primo segmento un terzo della lunghezza 
        myTurtle.ruota(-60); //ruota a sinistra
        vonKoch(n - 1, l / 3); //disegna il secondo segmento
        myTurtle.ruota(120); //ruota a destra
        vonKoch(n - 1, l / 3); //disegna il terzo segmento
        myTurtle.ruota(-60); //ruota a sinistra
        vonKoch(n - 1, l / 3); //disegna il quarto segmento
    }
};

for (let i = 0; i < 3; i++) { //un for per le 3 volte dei lati del triangolo
    vonKoch(n, l);
    myTurtle.ruota(120); //gira cosi ogni volta che finisce un lato del triangolo
}


var slider = document.getElementById("myRange");
var valIterazioni = document.getElementById("valIterazioni");

function ridisegna() {

    myTurtle.ctx.clearRect(0,0,myTurtle.canvas.width,myTurtle.canvas.height);

    myTurtle.setX(650);
    myTurtle.setY(200);
    myTurtle.setAngolo(0);

    for (let i = 0; i < 3; i++) {
        vonKoch(n, l);
        myTurtle.ruota(120);
    }

}

if(slider){

    n = parseInt(slider.value);
    valIterazioni.innerText = n;

    slider.oninput = function(){

        n = parseInt(this.value);
        valIterazioni.innerText = n;

        ridisegna();

    }
}
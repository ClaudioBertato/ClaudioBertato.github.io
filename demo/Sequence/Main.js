class Turtle {
    canvas= document.querySelector("#canvas");
    ctx= document.querySelector("#canvas").getContext('2d');
    x= 1423;
    y= 650; 
    angolo= 0; 
    colore= "blue";
    pennello= true;

    Turtle(){
    }

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
        this.angolo = this.angolo + a; //Aggiorna l'angolo
        while (this.angolo >= 360) { //Permette di avere sempre angoli compresi tra 0 e 359 gradi
            this.angolo -= 360; 
        }
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
let n = 20;
let l = 0.5; //Lato da disegnare
let str = "0";
myTurtle.ruota(-30);

function calcolaStringa(str, n){
    if(n === 0){
        return str;
    }
    let s = "";
    for(let i = 0; i < str.length; i ++){
        if(str[i] === "0"){
            s += "01";
        }
        else{
            if(str[i] === "1"){
                s += "10";
            }
        }
    }
    return calcolaStringa(s, n - 1)
}  

function disegna(str){
    for(let i = 0; i < str.length; i ++){

        if(myTurtle.getX() < 476){
            return;
        }

        if(str[i] === "0"){
            myTurtle.avanti(l);
        }
        else if(str[i] === "1"){
            myTurtle.ruota(60);
        }
    }
}

let s = calcolaStringa(str, n);
console.log(s);
disegna(s);


var slider = document.getElementById("myRange");
var valIterazioni = document.getElementById("valIterazioni");

function ridisegna(){

    myTurtle.ctx.clearRect(0,0,myTurtle.canvas.width,myTurtle.canvas.height);

    myTurtle.setX(1423);
    myTurtle.setY(650);
    myTurtle.setAngolo(0);
    myTurtle.ruota(-30);

    let s = calcolaStringa(str, n);

    disegna(s);

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
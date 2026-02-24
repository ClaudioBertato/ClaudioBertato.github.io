class Turtle {
    canvas= document.querySelector("#canvas");
    ctx= document.querySelector("#canvas").getContext('2d');
    x= 0;
    y= 700; 
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


let l = 200;
let nRicorsioni = 10;
let myTurtle = new Turtle();

function tree(n, l){
    if(n === 0){
        myTurtle.avanti(l);
        myTurtle.avanti(-l);
    } else {
        myTurtle.avanti(l);

        myTurtle.ruota(30);
        tree(n - 1, l / 1.5);
        myTurtle.ruota(-30);

        myTurtle.ruota(-30);
        tree(n - 1, l / 1.5)
        myTurtle.ruota(30);

        myTurtle.avanti(-l);
    }
}


//myTurtle.ruota(-30);
//myTurtle.avanti(l * 2/3);

myTurtle.avanti(1900 / 2);
myTurtle.ruota(-90);
tree(nRicorsioni - 1, l);
myTurtle.ruota(90);
myTurtle.avanti(1900 / 2);


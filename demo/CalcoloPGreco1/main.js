const canvas= document.querySelector("#canvas");
const ctx= canvas.getContext('2d');
let nIn = 0;
let n = 10000;
let r = 2;

function disegnaSchema(){

    let lato = Math.min(canvas.width, canvas.height) * 0.6;
    let x = (canvas.width - lato) / 2;
    let y = (canvas.height - lato) / 2;

    let centroX = canvas.width / 2;
    let centroY = canvas.height / 2;

    ctx.strokeStyle = "blue";

    ctx.beginPath();
    ctx.rect(x, y, lato, lato);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centroX, centroY, lato/2, 0, 360);
    ctx.stroke();
}

function isIn(x, y){

    let lato = Math.min(canvas.width, canvas.height) * 0.6;
    let centroX = canvas.width / 2;
    let centroY = canvas.height / 2;

    let d = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
    return d <= lato/2;
}

function monteCarlo(){

    let lato = Math.min(canvas.width, canvas.height) * 0.6;
    let startX = (canvas.width - lato) / 2;
    let startY = (canvas.height - lato) / 2;

    let x = Math.random() * lato + startX;
    let y = Math.random() * lato + startY;

    if(isIn(x, y)){
        nIn ++;
        ctx.strokeStyle = "red";
    }
    else{
        ctx.strokeStyle = "black";
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 360);
    ctx.stroke();
}

function avviaSimulazione() {
    nIn = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    disegnaSchema();

    for (let i = 0; i < n; i++) {
        monteCarlo();
    }

    let pGreco = 4 * (nIn / n);
    document.getElementById("risultato").innerText = "Valore calcolato π: " + pGreco.toFixed(4);
}

avviaSimulazione();

let sliderR = document.getElementById("sliderR");
let sliderN = document.getElementById("sliderN");

let valR = document.getElementById("valR");
let valN = document.getElementById("valN");

sliderR.oninput = function(){
    r = parseInt(this.value);
    valR.innerText = r;
    avviaSimulazione();
}

sliderN.oninput = function(){
    n = parseInt(this.value);
    valN.innerText = n;
    avviaSimulazione();
}

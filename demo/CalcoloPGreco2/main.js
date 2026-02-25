const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');

let r = Math.min(canvas.width, canvas.height) * 0.25;
let n = 1000;
let pGreco;

function calcolaPGreco() {

    let sommaBasi = 0;

    for (let i = 0; i <= n; i++) {

        let base = Math.sqrt(1 - Math.pow(i / n, 2));

        if (i === 0 || i === n) {
            sommaBasi += base;
        }
        else {
            sommaBasi += 2 * base;
        }
    }

    let areaTot = sommaBasi / (2 * n);

    return areaTot * 4;
}

function disegnaSchema() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let centroX = canvas.width / 2;
    let centroY = canvas.height / 2;

    r = Math.min(canvas.width, canvas.height) * 0.25;

    let h_pixel = r / n;

    let step = n > 500 ? Math.floor(n / 100) : 1;

    for (let i = 0; i < n; i += step) {

        let x1 = centroX + (i * h_pixel);
        let x2 = centroX + ((i + step) * h_pixel);

        let y1 = Math.sqrt(Math.pow(r, 2) - Math.pow(i * h_pixel, 2));
        let y2 = Math.sqrt(Math.pow(r, 2) - Math.pow((i + step) * h_pixel, 2));

        ctx.beginPath();

        ctx.fillStyle = "rgba(0, 100, 255, 0.2)";
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;

        ctx.moveTo(x1, centroY);
        ctx.lineTo(x1, centroY - y1);
        ctx.lineTo(x2, centroY - y2);
        ctx.lineTo(x2, centroY);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(centroX - r, centroY);
    ctx.lineTo(centroX + r, centroY);

    ctx.moveTo(centroX, centroY - r);
    ctx.lineTo(centroX, centroY + r);

    ctx.stroke();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(centroX, centroY - r);
    ctx.lineTo(centroX, centroY);
    ctx.lineTo(centroX + r, centroY);

    ctx.stroke();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.strokeRect(centroX - r, centroY - r, r * 2, r * 2);

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(centroX, centroY, r, 0, 2 * Math.PI);
    ctx.stroke();
}

function avviaSimulazione() {

    pGreco = calcolaPGreco();

    disegnaSchema();

    document.getElementById("risultato").innerText =
        "Valore calcolato π: " + pGreco.toFixed(6);
}

var slider = document.getElementById("myRange");
var valTrapezi = document.getElementById("valTrapezi");

if (slider) {

    n = parseInt(slider.value);

    valTrapezi.innerText = n;

    slider.oninput = function () {

        n = parseInt(this.value);

        valTrapezi.innerText = n;

        avviaSimulazione();
    };
}

avviaSimulazione();

const canvas = document.querySelector('#canvas');
const text = document.querySelector('#input-text');
const powerInput = document.querySelector('#input-power');
const button = document.querySelector('#plot-button');
const zoomInButton = document.querySelector('#zoomIn');
const zoomOutButton = document.querySelector('#zoomOut');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const centerX = width / 2;
const centerY = height / 2;
let SCALE = 30;

class Turtle {
    constructor(ctx) {
        this.ctx = ctx;
        this.x = centerX;
        this.y = centerY;
        this.isPenDown = true;
    }

    penUp() { this.isPenDown = false; }
    penDown() { this.isPenDown = true; }

    setStyle(color, width) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
    }

    goto(x, y) {
        if (this.isPenDown) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        this.x = x;
        this.y = y;
    }
}

function parseInput(input) {
    return input.split(',').map(Number);
}

function drawCartesianPlane() {
    const t = new Turtle(ctx);
   
    t.setStyle('#e0e0e0', 1);
    for (let i = -centerX; i <= centerX; i += SCALE) {
        t.penUp(); t.goto(centerX + i, 0); t.penDown(); t.goto(centerX + i, height);
    }
    for (let j = -centerY; j <= centerY; j += SCALE) {
        t.penUp(); t.goto(0, centerY + j); t.penDown(); t.goto(width, centerY + j);
    }

    t.setStyle('#000000', 3);
    t.penUp(); t.goto(0, centerY); t.penDown(); t.goto(width, centerY);
    t.penUp(); t.goto(centerX, 0); t.penDown(); t.goto(centerX, height);
}

function calculate(coefficients, startPower) {
    const points = [];
    const step = 0.1;

    for (let xMath = -centerX / SCALE; xMath <= centerX / SCALE; xMath += step) {
        let yMath = 0;
        let currentPower = startPower;

        for (let i = 0; i < coefficients.length; i++) {
            yMath += coefficients[i] * Math.pow(xMath, currentPower);
            currentPower--;
        }

        const canvasX = centerX + (xMath * SCALE);
        const canvasY = centerY - (yMath * SCALE);

        if (isFinite(canvasY)) {
            points.push({ x: canvasX, y: canvasY });
        }
    }
    return points;
}

function plotFunction(points) {
    if (points.length === 0) return;
    const t = new Turtle(ctx);
    t.setStyle('#ff4757', 4);
   
    t.penUp();
    t.goto(points[0].x, points[0].y);
    t.penDown();
   
    for (let i = 1; i < points.length; i++) {
        if (points[i].y < -1000 || points[i].y > height + 1000) {
            t.penUp();
        } else {
            t.goto(points[i].x, points[i].y);
            t.penDown();
        }
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
    drawCartesianPlane();
}

drawCartesianPlane();

button.addEventListener('click', () => {
    clearCanvas();
    const coefficients = parseInput(text.value);
    const startPower = parseFloat(powerInput.value);

    if (coefficients.some(isNaN) || isNaN(startPower)) {
        alert("Error: Check numbers!");
        return;
    }

    const points = calculate(coefficients, startPower);
    plotFunction(points);
});

zoomInButton.addEventListener('click', () => {
    SCALE *= 1.5;
    clearCanvas();
    const coefficients = parseInput(text.value);
    const startPower = parseFloat(powerInput.value);
    const points = calculate(coefficients, startPower);
    plotFunction(points);
});

zoomOutButton.addEventListener('click', () => {
    SCALE /= 1.5;
    clearCanvas();
    const coefficients = parseInput(text.value);
    const startPower = parseFloat(powerInput.value);
    const points = calculate(coefficients, startPower);
    plotFunction(points);
});
// Configurazione e Stato
const board = document.getElementById('game-board');
const wasteSlot = document.getElementById('waste-slot');
const deckSlot = document.getElementById('deck-slot');
const resetBtn = document.getElementById('reset-btn');

let deckId = '';
let selectedCards = [];

const CARD_VALUES = {
    "ACE": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, 
    "8": 8, "9": 9, "10": 10, "JACK": 11, "QUEEN": 12, "KING": 13
};

// --- Inizializzazione ---
async function initGame() {
    const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S,3S,4S,5S,6S,7S,8S,9S,10S,AH,2H,3H,4H,5H,6H,7H,8H,9H,10H,AD,2D,3D,4D,5D,6D,7D,8D,9D,10D,AH,2H,3H,4H,5H,6H,7H,8H,9H,10H');
    const data = await res.json();
    deckId = data.deck_id;

    const drawRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=28`);
    const drawData = await drawRes.json();
    
    renderPyramid(drawData.cards);
}

// --- Rendering della Piramide ---
function renderPyramid(cards) {
    let cardIdx = 0;
    const cardWidth = 200;
    const gapX = 90; // Spaziatura orizzontale
    const gapY = 60; // Spaziatura verticale

    for (let row = 0; row < 7; row++) {
        for (let col = 0; col <= row; col++) {
            const cardData = cards[cardIdx++];
            const img = document.createElement('img');
            
            img.src = cardData.image;
            img.className = 'card';
            img.id = `c-${row}-${col}`;
            img.dataset.val = CARD_VALUES[cardData.value];
            img.dataset.row = row;
            img.dataset.col = col;

            // Calcolo posizione centrale
            const rowTotalWidth = row * gapX;
            const x = (400 - (rowTotalWidth / 2)) + (col * gapX) - (cardWidth / 2);
            const y = row * gapY;

            img.style.left = `${x}px`;
            img.style.top = `${y}px`;
            img.style.zIndex = row;

            img.onclick = () => handleCardClick(img);
            board.appendChild(img);
        }
    }
    updateVisualStates();
}

// --- Logica di Gioco ---
function isCardFree(el) {
    // Se è nello scarto è sempre libera
    if (el.parentElement.id === 'waste-slot') return true;

    const r = parseInt(el.dataset.row);
    const c = parseInt(el.dataset.col);

    // Controlla se esistono le carte nelle posizioni che la coprono
    const childLeft = document.getElementById(`c-${r + 1}-${c}`);
    const childRight = document.getElementById(`c-${r + 1}-${c + 1}`);

    return !childLeft && !childRight;
}

function updateVisualStates() {
    document.querySelectorAll('#game-board .card').forEach(card => {
        if (isCardFree(card)) card.classList.remove('blocked');
        else card.classList.add('blocked');
    });
}

function handleCardClick(card) {
    if (!isCardFree(card)) return;

    const val = parseInt(card.dataset.val);

    // Regola speciale: il 10 si elimina da solo
    if (val === 10) {
        card.remove();
        selectedCards = [];
        updateVisualStates();
        checkWin();
        return;
    }

    // Gestione Selezione
    if (selectedCards.includes(card)) {
        card.classList.remove('selected');
        selectedCards = [];
        return;
    }

    card.classList.add('selected');
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        const sum = parseInt(selectedCards[0].dataset.val) + parseInt(selectedCards[1].dataset.val);
        
        if (sum === 10) {
            selectedCards.forEach(c => c.remove());
            updateVisualStates();
            checkWin();
        } else {
            selectedCards.forEach(c => c.classList.remove('selected'));
        }
        selectedCards = [];
    }
}

async function drawFromDeck() {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await res.json();
    
    if (data.cards.length > 0) {
        wasteSlot.innerHTML = '';
        const c = data.cards[0];
        const img = document.createElement('img');
        img.src = c.image;
        img.className = 'card';
        img.dataset.val = CARD_VALUES[c.value];
        img.style.position = 'relative'; // Reset posizionamento assoluto
        img.onclick = () => handleCardClick(img);
        wasteSlot.appendChild(img);
    } else {
        alert("Mazzo terminato!");
    }
}

function checkWin() {
    if (document.querySelectorAll('#game-board .card').length === 0) {
        alert("Complimenti! Hai svuotato la piramide!");
    }
}

// --- Event Listeners ---
deckSlot.addEventListener('click', drawFromDeck);
resetBtn.addEventListener('click', () => location.reload());

// Start!
initGame();
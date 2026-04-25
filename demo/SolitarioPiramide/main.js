const board = document.getElementById('game-board');
const wasteSlot = document.getElementById('waste-slot');
const deckSlot = document.getElementById('deck-slot');
const resetBtn = document.getElementById('reset-btn');

const BACK_IMG = "https://deckofcardsapi.com/static/img/back.png";
let deckId = '';
let selectedCards = []; //array di carte selezionate 

const CARD_VALUES = {
    "ACE": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10
};

async function initGame() {
    // Mazzo filtrato 1-10
    const filter = "AS,2S,3S,4S,5S,6S,7S,8S,9S,10S,AH,2H,3H,4H,5H,6H,7H,8H,9H,10H,AD,2D,3D,4D,5D,6D,7D,8D,9D,10D,AC,2C,3C,4C,5C,6C,7C,8C,9C,10C";
    const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${filter}`);
    const data = await response.json();
    deckId = data.deck_id;

    const drawRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=28`);
    const drawData = await drawRes.json();
    
    disegnaPiramide(drawData.cards);
}

function disegnaPiramide(cards) {
    let cardIdx = 0;
    const cardW = 80; //Larghezza carte
    const gapX = 90; //Distanza tra le carte orrizzontalmente
    const gapY = 60; //Distanza tra le carte verrticalmente

    for (let row = 0; row < 7; row++) {
        for (let col = 0; col <= row; col++) {
            const cardData = cards[cardIdx++];
            const img = document.createElement('img');
            
            img.className = 'card';
            img.id = `c-${row}-${col}`;
            
            
            img.dataset.front = cardData.image; 
            img.src = BACK_IMG; // All'inizio mostriamo il retro
            
            img.dataset.val = CARD_VALUES[cardData.value];
            img.dataset.row = row;
            img.dataset.col = col;

            const x = (400 - (row * gapX / 2)) + (col * gapX) - (cardW / 2); //trova posizione x della carta in base al numero di carte
            const y = row * gapY; 

            img.style.left = `${x}px`;
            img.style.top = `${y}px`;
            img.style.zIndex = row; //sovrapposizione delle carte

            img.onclick = () => clickCarta(img);
            board.appendChild(img);
        }
    }
    aggiornaStato();
}

function isCardFree(el) {
    if (el.parentElement.id === 'waste-slot') return true;
    const r = parseInt(el.dataset.row);
    const c = parseInt(el.dataset.col);
    const childLeft = document.getElementById(`c-${r + 1}-${c}`);
    const childRight = document.getElementById(`c-${r + 1}-${c + 1}`);
    return !childLeft && !childRight;
}

function aggiornaStato() {
    document.querySelectorAll('#game-board .card').forEach(card => {
        if (isCardFree(card)) {
            card.classList.remove('blocked'); //Gira la carta
            card.src = card.dataset.front; 
        } else {
            card.classList.add('blocked');
            card.src = BACK_IMG; 
        }
    });
}

function clickCarta(card) {
    if (!isCardFree(card)) return;

    const val = parseInt(card.dataset.val);

    if (val === 10) { //In caso di Re
        card.remove();
        selectedCards = [];
        aggiornaStato();
        return;
    }

    if (selectedCards.includes(card)) { //Deselezione
        card.classList.remove('selected');
        selectedCards = [];
        return;
    }

    card.classList.add('selected');
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        const v1 = parseInt(selectedCards[0].dataset.val);
        const v2 = parseInt(selectedCards[1].dataset.val);

        if (v1 + v2 === 10) {
            selectedCards.forEach(c => c.remove());
            aggiornaStato();
        } else {
            selectedCards.forEach(c => c.classList.remove('selected'));
        }
        selectedCards = [];
    }
}

async function usaMazzo() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await response.json();
    if (data.cards.length > 0) {
        wasteSlot.innerHTML = '';
        const c = data.cards[0];
        const img = document.createElement('img');
        img.src = c.image;
        img.className = 'card';
        img.dataset.val = CARD_VALUES[c.value];
        img.style.position = 'relative'; 
        img.onclick = () => clickCarta(img);
        wasteSlot.appendChild(img);
    }
}

deckSlot.addEventListener('click', usaMazzo);
resetBtn.addEventListener('click', () => location.reload());

initGame();
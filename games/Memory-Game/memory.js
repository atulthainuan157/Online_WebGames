const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const restartBtn = document.getElementById('restartBtn');

const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
let cards = [], hasFlippedCard = false, lockBoard = false, firstCard, secondCard, moves = 0, pairs = 0;

function init() {
    grid.innerHTML = '';
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    moves = 0; pairs = 0;
    movesEl.textContent = moves; pairsEl.textContent = `${pairs}/8`;
    hasFlippedCard = false; lockBoard = false; firstCard = null; secondCard = null;

    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.innerHTML = `<div class="front">?</div><div class="back">${emoji}</div>`;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesEl.textContent = moves;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    pairs++;
    pairsEl.textContent = `${pairs}/8`;
    setTimeout(() => {
        firstCard.classList.add('match');
        secondCard.classList.add('match');
        resetBoard();
        if (pairs === 8) setTimeout(() => alert(`You won in ${moves} moves!`), 500);
    }, 500);
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

restartBtn.addEventListener('click', init);
init();

const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const newGameBtn = document.getElementById('new-game-btn');
const retryBtn = document.getElementById('retry-btn');
const gameMessage = document.getElementById('game-message');
const messageText = document.getElementById('message-text');

let grid = [];
let score = 0;
let highScore = localStorage.getItem('2048HighScore') || 0;
let hasWon = false;

highScoreElement.textContent = highScore;

function initGame() {
    gridElement.innerHTML = '';
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    hasWon = false;
    updateScore(0);
    gameMessage.classList.add('hidden');
    gameMessage.classList.remove('game-won');
    
    // Create initial cells
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.id = `cell-${r}-${c}`;
            gridElement.appendChild(cell);
        }
    }
    
    addRandomTile();
    addRandomTile();
    drawGrid();
}

function addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) {
                emptyCells.push({r, c});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function drawGrid() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            const val = grid[r][c];
            cell.textContent = val === 0 ? '' : val;
            cell.className = 'grid-cell'; // reset classes
            if (val > 0) {
                cell.classList.add(`tile-${val}`);
            }
        }
    }
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('2048HighScore', highScore);
    }
}

function slide(row) {
    let arr = row.filter(val => val); // remove 0s
    let missing = 4 - arr.length;
    let zeros = Array(missing).fill(0);
    return arr.concat(zeros);
}

function combine(row) {
    for (let i = 0; i < 3; i++) {
        if (row[i] !== 0 && row[i] === row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            updateScore(row[i]);
            if (row[i] === 2048 && !hasWon) {
                hasWon = true;
                showVictory();
            }
        }
    }
    return row;
}

function slideLeft() {
    let changed = false;
    for (let r = 0; r < 4; r++) {
        let row = grid[r];
        let newRow = slide(row);
        newRow = combine(newRow);
        newRow = slide(newRow);
        if (row.join(',') !== newRow.join(',')) changed = true;
        grid[r] = newRow;
    }
    return changed;
}

function slideRight() {
    let changed = false;
    for (let r = 0; r < 4; r++) {
        let row = grid[r].slice().reverse();
        let newRow = slide(row);
        newRow = combine(newRow);
        newRow = slide(newRow);
        newRow.reverse();
        if (grid[r].join(',') !== newRow.join(',')) changed = true;
        grid[r] = newRow;
    }
    return changed;
}

function slideUp() {
    let changed = false;
    for (let c = 0; c < 4; c++) {
        let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        let newCol = slide(col);
        newCol = combine(newCol);
        newCol = slide(newCol);
        if (col.join(',') !== newCol.join(',')) changed = true;
        for (let r = 0; r < 4; r++) grid[r][c] = newCol[r];
    }
    return changed;
}

function slideDown() {
    let changed = false;
    for (let c = 0; c < 4; c++) {
        let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]].reverse();
        let newCol = slide(col);
        newCol = combine(newCol);
        newCol = slide(newCol);
        newCol.reverse();
        if (col.reverse().join(',') !== newCol.join(',')) changed = true;
        for (let r = 0; r < 4; r++) grid[r][c] = newCol[r];
    }
    return changed;
}

function checkGameOver() {
    // Check for empty cells
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) return false;
        }
    }
    // Check for possible merges
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
            if (grid[r][c] === grid[r][c+1]) return false;
        }
    }
    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 3; r++) {
            if (grid[r][c] === grid[r+1][c]) return false;
        }
    }
    
    // Game over
    messageText.textContent = 'Game Over!';
    gameMessage.classList.remove('hidden');
    return true;
}

function showVictory() {
    messageText.textContent = 'You Win!';
    gameMessage.classList.add('game-won');
    gameMessage.classList.remove('hidden');
    retryBtn.textContent = "Keep Playing";
    retryBtn.onclick = () => {
        gameMessage.classList.add('hidden');
        retryBtn.textContent = "Try Again";
        retryBtn.onclick = initGame;
    };
}

document.addEventListener('keydown', (e) => {
    if (!gameMessage.classList.contains('hidden') && e.code !== 'Escape') {
        if(e.code === 'Enter' || e.code === 'Space') {
            if(hasWon && retryBtn.textContent === "Keep Playing") {
                retryBtn.click();
            } else {
                initGame();
            }
        }
        return;
    }
    
    let changed = false;
    
    // Prevent default scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
    
    switch(e.code) {
        case 'ArrowUp':
        case 'KeyW':
            changed = slideUp();
            break;
        case 'ArrowDown':
        case 'KeyS':
            changed = slideDown();
            break;
        case 'ArrowLeft':
        case 'KeyA':
            changed = slideLeft();
            break;
        case 'ArrowRight':
        case 'KeyD':
            changed = slideRight();
            break;
    }
    
    if (changed) {
        addRandomTile();
        drawGrid();
        checkGameOver();
    }
});

newGameBtn.addEventListener('click', initGame);
retryBtn.addEventListener('click', initGame);

// Start game initially
initGame();

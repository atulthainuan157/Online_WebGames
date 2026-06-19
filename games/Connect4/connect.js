const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'red';
let gameOver = false;

function init() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    currentPlayer = 'red';
    gameOver = false;
    updateStatus();
    render();
}

function render() {
    boardEl.innerHTML = '';
    for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if(board[r][c]) cell.classList.add(board[r][c]);
            cell.dataset.r = r; cell.dataset.c = c;
            cell.addEventListener('click', () => handleClick(c));
            boardEl.appendChild(cell);
        }
    }
}

function updateStatus() {
    if(gameOver) return;
    statusEl.textContent = `${currentPlayer === 'red' ? 'Red' : 'Yellow'}'s Turn`;
    statusEl.className = `status ${currentPlayer}`;
}

function handleClick(col) {
    if(gameOver) return;
    
    // Find lowest empty row in col
    let row = -1;
    for(let r=ROWS-1; r>=0; r--) {
        if(!board[r][col]) { row = r; break; }
    }
    
    if(row !== -1) {
        board[row][col] = currentPlayer;
        render();
        
        if(checkWin(row, col)) {
            gameOver = true;
            statusEl.textContent = `${currentPlayer === 'red' ? 'Red' : 'Yellow'} Wins!`;
            statusEl.className = `status ${currentPlayer}`;
            return;
        }
        
        if(checkTie()) {
            gameOver = true;
            statusEl.textContent = "It's a Tie!";
            statusEl.className = 'status';
            return;
        }
        
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        updateStatus();
    }
}

function checkTie() {
    for(let c=0; c<COLS; c++) if(!board[0][c]) return false;
    return true;
}

function checkWin(r, c) {
    return checkDirection(r, c, 1, 0) || // Horizontal (really this checks vertical because of dr, dc?) Wait, dr=1, dc=0 means vertical
           checkDirection(r, c, 0, 1) || // Horizontal
           checkDirection(r, c, 1, 1) || // Diagonal \
           checkDirection(r, c, 1, -1);  // Diagonal /
}

function checkDirection(r, c, dr, dc) {
    let count = 1;
    let currR, currC;
    
    // Check one way
    currR = r + dr; currC = c + dc;
    while(currR >= 0 && currR < ROWS && currC >= 0 && currC < COLS && board[currR][currC] === currentPlayer) {
        count++; currR += dr; currC += dc;
    }
    
    // Check other way
    currR = r - dr; currC = c - dc;
    while(currR >= 0 && currR < ROWS && currC >= 0 && currC < COLS && board[currR][currC] === currentPlayer) {
        count++; currR -= dr; currC -= dc;
    }
    
    return count >= 4;
}

restartBtn.addEventListener('click', init);
init();

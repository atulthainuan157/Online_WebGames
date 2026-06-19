const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const initialBoard = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];

const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

let board = [];
let turn = 'w';
let selectedPos = null;
let gameOver = false;

function init() {
    board = JSON.parse(JSON.stringify(initialBoard));
    turn = 'w';
    selectedPos = null;
    gameOver = false;
    statusEl.textContent = "White's Turn";
    render();
}

function render() {
    boardEl.innerHTML = '';
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(r+c)%2===0 ? 'light' : 'dark'}`;
            cell.dataset.r = r; cell.dataset.c = c;
            
            if(board[r][c]) {
                cell.textContent = pieces[board[r][c]];
                if(board[r][c] === board[r][c].toUpperCase()) cell.style.color = '#fff';
                else cell.style.color = '#000';
            }
            
            if(selectedPos && selectedPos.r === r && selectedPos.c === c) {
                cell.classList.add('selected');
            }
            
            cell.addEventListener('click', () => handleClick(r, c));
            boardEl.appendChild(cell);
        }
    }
}

function isWhite(piece) { return piece && piece === piece.toUpperCase(); }
function isBlack(piece) { return piece && piece === piece.toLowerCase(); }

function handleClick(r, c) {
    if(gameOver) return;
    
    if(selectedPos) {
        if(isValidMove(selectedPos.r, selectedPos.c, r, c)) {
            const targetPiece = board[r][c];
            board[r][c] = board[selectedPos.r][selectedPos.c];
            board[selectedPos.r][selectedPos.c] = '';
            selectedPos = null;
            turn = turn === 'w' ? 'b' : 'w';
            statusEl.textContent = turn === 'w' ? "White's Turn" : "Black's Turn";
            
            if(targetPiece.toLowerCase() === 'k') {
                gameOver = true;
                statusEl.textContent = turn === 'w' ? "Black Wins!" : "White Wins!";
            }
            
            render();
            if(!gameOver && turn === 'b') setTimeout(aiMove, 500);
        } else {
            selectedPos = null;
            render();
        }
    } else {
        const p = board[r][c];
        if(p && ((turn === 'w' && isWhite(p)) || (turn === 'b' && isBlack(p)))) {
            selectedPos = {r, c};
            render();
        }
    }
}

function isValidMove(r1, c1, r2, c2) {
    const p1 = board[r1][c1];
    const p2 = board[r2][c2];
    
    if(r1 === r2 && c1 === c2) return false;
    if(p2 && ((isWhite(p1) && isWhite(p2)) || (isBlack(p1) && isBlack(p2)))) return false;

    const dr = r2 - r1;
    const dc = c2 - c1;
    const p = p1.toLowerCase();
    
    if(p === 'p') {
        const dir = isWhite(p1) ? -1 : 1;
        const startRow = isWhite(p1) ? 6 : 1;
        if(dc === 0 && !p2 && (dr === dir || (r1 === startRow && dr === 2*dir && !board[r1+dir][c1]))) return true;
        if(Math.abs(dc) === 1 && dr === dir && p2) return true;
        return false;
    }
    if(p === 'n') {
        return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    }
    if(p === 'k') {
        return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    }
    
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
    
    if(p === 'r' || p === 'q') {
        if(dr === 0 || dc === 0) {
            let cr = r1 + stepR, cc = c1 + stepC;
            while(cr !== r2 || cc !== c2) {
                if(board[cr][cc]) return false;
                cr += stepR; cc += stepC;
            }
            return true;
        }
    }
    if(p === 'b' || p === 'q') {
        if(Math.abs(dr) === Math.abs(dc)) {
            let cr = r1 + stepR, cc = c1 + stepC;
            while(cr !== r2 || cc !== c2) {
                if(board[cr][cc]) return false;
                cr += stepR; cc += stepC;
            }
            return true;
        }
    }
    
    return false;
}

function aiMove() {
    if(gameOver) return;
    let moves = [];
    for(let r1=0; r1<8; r1++) {
        for(let c1=0; c1<8; c1++) {
            if(isBlack(board[r1][c1])) {
                for(let r2=0; r2<8; r2++) {
                    for(let c2=0; c2<8; c2++) {
                        if(isValidMove(r1, c1, r2, c2)) {
                            // Give capturing moves more weight
                            moves.push({r1, c1, r2, c2, w: board[r2][c2] ? 10 : 1});
                        }
                    }
                }
            }
        }
    }
    
    if(moves.length > 0) {
        // simple random weighted
        moves.sort((a,b) => b.w - a.w);
        const bestMoves = moves.filter(m => m.w === moves[0].w);
        const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        
        const targetPiece = board[move.r2][move.c2];
        board[move.r2][move.c2] = board[move.r1][move.c1];
        board[move.r1][move.c1] = '';
        turn = 'w';
        statusEl.textContent = "White's Turn";
        
        if(targetPiece.toLowerCase() === 'k') {
            gameOver = true;
            statusEl.textContent = "Black Wins!";
        }
        render();
    } else {
        gameOver = true;
        statusEl.textContent = "Stalemate / White Wins!";
    }
}

restartBtn.addEventListener('click', init);
init();

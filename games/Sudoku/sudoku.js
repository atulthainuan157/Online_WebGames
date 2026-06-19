const boardEl = document.getElementById('board');
const newGameBtn = document.getElementById('newGame');
const solveBtn = document.getElementById('solveBtn');
let grid = Array(9).fill().map(() => Array(9).fill(0));
let solution = Array(9).fill().map(() => Array(9).fill(0));

function isValid(board, r, c, k) {
    for (let i = 0; i < 9; i++) {
        if (board[r][i] === k || board[i][c] === k) return false;
        if (board[3 * Math.floor(r / 3) + Math.floor(i / 3)][3 * Math.floor(c / 3) + i % 3] === k) return false;
    }
    return true;
}

function solve(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (let k = 1; k <= 9; k++) {
                    if (isValid(board, r, c, k)) {
                        board[r][c] = k;
                        if (solve(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function generate() {
    grid = Array(9).fill().map(() => Array(9).fill(0));
    solution = Array(9).fill().map(() => Array(9).fill(0));
    
    // Fill diagonal boxes
    for(let i=0; i<9; i+=3) {
        for(let r=0; r<3; r++) {
            for(let c=0; c<3; c++) {
                let num;
                do { num = Math.floor(Math.random()*9)+1; } while(!isValid(grid, i+r, i+c, num));
                grid[i+r][i+c] = num;
            }
        }
    }
    solve(grid);
    solution = JSON.parse(JSON.stringify(grid));
    
    // Remove cells
    let count = 40; // Empty cells
    while(count > 0) {
        let r = Math.floor(Math.random()*9), c = Math.floor(Math.random()*9);
        if(grid[r][c] !== 0) { grid[r][c] = 0; count--; }
    }
    render();
}

function render() {
    boardEl.innerHTML = '';
    for(let r=0; r<9; r++) {
        for(let c=0; c<9; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (grid[r][c] !== 0) {
                cell.classList.add('fixed');
                cell.textContent = grid[r][c];
            } else {
                const inp = document.createElement('input');
                inp.type = 'number';
                inp.min = 1; inp.max = 9;
                inp.dataset.r = r; inp.dataset.c = c;
                inp.addEventListener('input', checkInput);
                cell.appendChild(inp);
            }
            boardEl.appendChild(cell);
        }
    }
}

function checkInput(e) {
    const val = parseInt(e.target.value);
    const r = e.target.dataset.r, c = e.target.dataset.c;
    
    if (e.target.value === '') {
        e.target.parentElement.classList.remove('error');
        return;
    }
    
    if (val < 1 || val > 9 || isNaN(val)) { e.target.value = ''; return; }
    
    if (val !== solution[r][c]) {
        e.target.parentElement.classList.add('error');
    } else {
        e.target.parentElement.classList.remove('error');
        checkWin();
    }
}

function checkWin() {
    const inputs = document.querySelectorAll('input');
    let win = true;
    inputs.forEach(inp => {
        if(inp.parentElement.classList.contains('error') || inp.value === '') win = false;
    });
    if(win) setTimeout(() => alert('Congratulations! You solved it!'), 200);
}

newGameBtn.addEventListener('click', generate);
solveBtn.addEventListener('click', () => {
    grid = JSON.parse(JSON.stringify(solution));
    render();
});
generate();

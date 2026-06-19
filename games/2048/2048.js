const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
let grid, score;

function init() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    scoreEl.textContent = '0';
    addTile(); addTile();
    render();
}

function addTile() {
    const empty = [];
    grid.forEach((r, i) => r.forEach((v, j) => { if (v === 0) empty.push([i, j]); }));
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
    boardEl.innerHTML = '';
    grid.forEach(row => row.forEach(val => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = val || '';
        if (val) tile.dataset.value = val;
        boardEl.appendChild(tile);
    }));
}

function slide(row) {
    let arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr.splice(i + 1, 1);
        }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
}

function move(dir) {
    let moved = false;
    const old = JSON.stringify(grid);

    if (dir === 'left') {
        for (let r = 0; r < 4; r++) grid[r] = slide(grid[r]);
    } else if (dir === 'right') {
        for (let r = 0; r < 4; r++) grid[r] = slide(grid[r].reverse()).reverse();
    } else if (dir === 'up') {
        for (let c = 0; c < 4; c++) {
            let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
            col = slide(col);
            for (let r = 0; r < 4; r++) grid[r][c] = col[r];
        }
    } else if (dir === 'down') {
        for (let c = 0; c < 4; c++) {
            let col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
            col = slide(col);
            for (let r = 0; r < 4; r++) grid[3 - r][c] = col[r];
        }
    }

    if (JSON.stringify(grid) !== old) {
        addTile();
        scoreEl.textContent = score;
        render();
        if (isGameOver()) setTimeout(() => alert('Game Over! Score: ' + score), 200);
    }
}

function isGameOver() {
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) return false;
            if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
            if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
        }
    return true;
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); move('left'); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); move('right'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move('up'); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move('down'); }
});

// Swipe support
let sx, sy;
boardEl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
boardEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
});

document.getElementById('newGame').addEventListener('click', init);
init();

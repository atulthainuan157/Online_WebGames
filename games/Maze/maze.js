const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelEl = document.getElementById('level');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

let cols, rows;
let size = 20;
let grid = [];
let current;
let stack = [];
let player = {x: 0, y: 0};
let goal = {x: 0, y: 0};
let level = 1;
let mazeGenerated = false;

class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true]; // top, right, bottom, left
        this.visited = false;
    }
    
    checkNeighbors() {
        let neighbors = [];
        let top    = grid[index(this.i, this.j - 1)];
        let right  = grid[index(this.i + 1, this.j)];
        let bottom = grid[index(this.i, this.j + 1)];
        let left   = grid[index(this.i - 1, this.j)];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
            let r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    }
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) return -1;
    return i + j * cols;
}

function removeWalls(a, b) {
    let x = a.i - b.i;
    if (x === 1) { a.walls[3] = false; b.walls[1] = false; }
    else if (x === -1) { a.walls[1] = false; b.walls[3] = false; }
    let y = a.j - b.j;
    if (y === 1) { a.walls[0] = false; b.walls[2] = false; }
    else if (y === -1) { a.walls[2] = false; b.walls[0] = false; }
}

function generateMaze() {
    cols = Math.floor(canvas.width / size);
    rows = Math.floor(canvas.height / size);
    grid = [];
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            grid.push(new Cell(i, j));
        }
    }
    current = grid[0];
    current.visited = true;
    stack = [];
    
    // Generate instantly
    while(true) {
        let next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            stack.push(current);
            removeWalls(current, next);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            break;
        }
    }
    
    player = {x: 0, y: 0};
    goal = {x: cols - 1, y: rows - 1};
    mazeGenerated = true;
}

function draw() {
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < grid.length; i++) {
        let x = grid[i].i * size;
        let y = grid[i].j * size;
        
        ctx.beginPath();
        if (grid[i].walls[0]) { ctx.moveTo(x, y); ctx.lineTo(x + size, y); }
        if (grid[i].walls[1]) { ctx.moveTo(x + size, y); ctx.lineTo(x + size, y + size); }
        if (grid[i].walls[2]) { ctx.moveTo(x + size, y + size); ctx.lineTo(x, y + size); }
        if (grid[i].walls[3]) { ctx.moveTo(x, y + size); ctx.lineTo(x, y); }
        ctx.stroke();
    }
    
    // Goal
    ctx.fillStyle = '#0f0';
    ctx.fillRect(goal.x * size + 4, goal.y * size + 4, size - 8, size - 8);
    
    // Player
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(player.x * size + size/2, player.y * size + size/2, size/2 - 4, 0, Math.PI * 2);
    ctx.fill();
}

function move(dx, dy) {
    if (!mazeGenerated) return;
    
    let cell = grid[index(player.x, player.y)];
    
    if (dx === 1 && !cell.walls[1]) player.x += 1;
    else if (dx === -1 && !cell.walls[3]) player.x -= 1;
    else if (dy === 1 && !cell.walls[2]) player.y += 1;
    else if (dy === -1 && !cell.walls[0]) player.y -= 1;
    
    draw();
    
    if (player.x === goal.x && player.y === goal.y) {
        mazeGenerated = false;
        level++;
        levelEl.textContent = level;
        if(size > 10) size -= 2; // Increase difficulty by making smaller cells
        overlay.style.display = 'flex';
        overlayText.textContent = `Level ${level}! Tap to continue.`;
        positionOverlay();
    }
}

function init() {
    overlay.style.display = 'none';
    generateMaze();
    draw();
}

function changeDir(dir) {
    if (!mazeGenerated) { init(); return; }
    if (dir === 'up') move(0, -1);
    else if (dir === 'down') move(0, 1);
    else if (dir === 'left') move(-1, 0);
    else if (dir === 'right') move(1, 0);
}

document.addEventListener('keydown', e => {
    if (!mazeGenerated && e.code === 'Space') { e.preventDefault(); init(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); changeDir('up'); }
    if (e.key === 'ArrowDown') { e.preventDefault(); changeDir('down'); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); changeDir('left'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); changeDir('right'); }
});

function positionOverlay() {
    const r = canvas.getBoundingClientRect();
    overlay.style.left = r.left + 'px'; overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px'; overlay.style.height = r.height + 'px';
}

window.addEventListener('resize', positionOverlay);
positionOverlay();

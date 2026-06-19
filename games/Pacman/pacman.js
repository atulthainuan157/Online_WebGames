const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

const grid = 20;
const cols = canvas.width / grid;
const rows = canvas.height / grid;

// 1 = Wall, 0 = Dot, 2 = Empty
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,1,2,1,1,2,1,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,2,2,1,2,1,0,1,1,1,1,1],
    [2,2,2,2,2,0,2,2,1,2,2,1,2,2,0,2,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,2,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,2,2,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
let currentMap = [];

let pacman = { x: 9, y: 16, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouth: 0.2, mouthDir: 1 };
let ghosts = [];
const startGhosts = [
    { x: 9, y: 8, color: '#f00' }, // Blinky
    { x: 10, y: 8, color: '#ffb8ff' }, // Pinky
    { x: 9, y: 10, color: '#0ff' }, // Inky
    { x: 10, y: 10, color: '#ffb852' } // Clyde
];

let score = 0, lives = 3, dots = 0, running = false, frameCount = 0;

function init() {
    currentMap = JSON.parse(JSON.stringify(map));
    dots = 0;
    currentMap.forEach(row => row.forEach(val => { if (val === 0) dots++; }));
    resetPositions();
    score = 0; lives = 3;
    scoreEl.textContent = score; livesEl.textContent = lives;
    running = false;
    draw();
    overlay.style.display = 'flex';
    overlayText.textContent = 'Press Space or Tap to Start';
    positionOverlay();
}

function positionOverlay() {
    const r = canvas.getBoundingClientRect();
    overlay.style.left = r.left + 'px'; overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px'; overlay.style.height = r.height + 'px';
}

function resetPositions() {
    pacman = { x: 9, y: 16, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouth: 0.2, mouthDir: 1 };
    ghosts = startGhosts.map(g => ({ ...g, dx: 0, dy: 0, timer: 0 }));
}

function canMove(x, y, dx, dy) {
    let nx = x + dx, ny = y + dy;
    if (nx < 0) nx = cols - 1;
    if (nx >= cols) nx = 0;
    return currentMap[ny] && currentMap[ny][nx] !== 1;
}

function wrap(val, max) {
    if (val < 0) return max - 1;
    if (val >= max) return 0;
    return val;
}

function update() {
    if (!running) return;
    frameCount++;

    // Pacman Movement
    if (frameCount % 6 === 0) {
        if (canMove(pacman.x, pacman.y, pacman.nextDx, pacman.nextDy)) {
            pacman.dx = pacman.nextDx;
            pacman.dy = pacman.nextDy;
        }
        if (canMove(pacman.x, pacman.y, pacman.dx, pacman.dy)) {
            pacman.x = wrap(pacman.x + pacman.dx, cols);
            pacman.y = wrap(pacman.y + pacman.dy, rows);
        }

        // Eat dot
        if (currentMap[pacman.y][pacman.x] === 0) {
            currentMap[pacman.y][pacman.x] = 2;
            score += 10;
            scoreEl.textContent = score;
            dots--;
            if (dots === 0) {
                gameOver(true); return;
            }
        }

        // Mouth animation
        pacman.mouth += 0.1 * pacman.mouthDir;
        if (pacman.mouth >= 0.4 || pacman.mouth <= 0) pacman.mouthDir *= -1;

        // Ghosts Movement
        ghosts.forEach(g => {
            if (g.dx === 0 && g.dy === 0) { g.dx = 1; g.dy = 0; } // Start moving
            
            let possibleMoves = [];
            [[0,-1],[0,1],[-1,0],[1,0]].forEach(dir => {
                // Don't reverse unless hit a dead end
                if (dir[0] === -g.dx && dir[1] === -g.dy) return;
                if (canMove(g.x, g.y, dir[0], dir[1])) possibleMoves.push(dir);
            });

            if (possibleMoves.length === 0) {
                g.dx *= -1; g.dy *= -1; // Reverse
            } else if (possibleMoves.length > 1 || !canMove(g.x, g.y, g.dx, g.dy)) {
                // Pick random
                const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                g.dx = move[0]; g.dy = move[1];
            }

            g.x = wrap(g.x + g.dx, cols);
            g.y = wrap(g.y + g.dy, rows);
        });

        // Collision
        if (ghosts.some(g => g.x === pacman.x && g.y === pacman.y)) {
            lives--;
            livesEl.textContent = lives;
            if (lives <= 0) gameOver(false);
            else {
                running = false;
                resetPositions();
                overlay.style.display = 'flex';
                overlayText.textContent = 'Tap to Resume';
            }
        }
    }
    draw();
    if (running) requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Map
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (currentMap[y][x] === 1) {
                ctx.fillStyle = '#1919a6';
                ctx.fillRect(x * grid, y * grid, grid, grid);
            } else if (currentMap[y][x] === 0) {
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath();
                ctx.arc(x * grid + grid/2, y * grid + grid/2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Ghosts
    ghosts.forEach(g => {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        const gx = g.x * grid; const gy = g.y * grid;
        ctx.arc(gx + grid/2, gy + grid/2, grid/2 - 2, Math.PI, 0);
        ctx.lineTo(gx + grid - 2, gy + grid - 2);
        ctx.lineTo(gx + grid/2, gy + grid/2 + 2);
        ctx.lineTo(gx + 2, gy + grid - 2);
        ctx.fill();
    });

    // Pacman
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    let angleOffset = 0;
    if (pacman.dx === 1) angleOffset = 0;
    else if (pacman.dx === -1) angleOffset = Math.PI;
    else if (pacman.dy === -1) angleOffset = -Math.PI/2;
    else if (pacman.dy === 1) angleOffset = Math.PI/2;
    
    ctx.arc(pacman.x * grid + grid/2, pacman.y * grid + grid/2, grid/2 - 2, 
        angleOffset + pacman.mouth * Math.PI, 
        angleOffset + (2 - pacman.mouth) * Math.PI);
    ctx.lineTo(pacman.x * grid + grid/2, pacman.y * grid + grid/2);
    ctx.fill();
}

function gameOver(win) {
    running = false;
    overlay.style.display = 'flex';
    overlayText.textContent = win ? `You Win! Score: ${score}\nTap to Restart` : `Game Over!\nTap to Restart`;
}

function changeDir(dir) {
    if (!running && lives > 0) {
        running = true;
        overlay.style.display = 'none';
        update();
    } else if (lives <= 0 || dots === 0) init();

    if (dir === 'up') { pacman.nextDx = 0; pacman.nextDy = -1; }
    else if (dir === 'down') { pacman.nextDx = 0; pacman.nextDy = 1; }
    else if (dir === 'left') { pacman.nextDx = -1; pacman.nextDy = 0; }
    else if (dir === 'right') { pacman.nextDx = 1; pacman.nextDy = 0; }
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); changeDir(''); }
    if (e.key === 'ArrowUp') { e.preventDefault(); changeDir('up'); }
    if (e.key === 'ArrowDown') { e.preventDefault(); changeDir('down'); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); changeDir('left'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); changeDir('right'); }
});

canvas.addEventListener('click', () => changeDir(''));
window.addEventListener('resize', positionOverlay);
init();

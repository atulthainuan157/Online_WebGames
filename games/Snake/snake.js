const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

const grid = 20;
const tileCount = canvas.width / grid;
let snake, food, dx, dy, score, highScore, gameLoop, running, speed;

function init() {
    snake = [{ x: 10, y: 10 }];
    food = spawnFood();
    dx = 0; dy = 0;
    score = 0;
    speed = 120;
    running = false;
    highScore = parseInt(localStorage.getItem('snakeHigh') || '0');
    highScoreEl.textContent = highScore;
    scoreEl.textContent = '0';
    draw();
    overlay.style.display = 'flex';
    overlayText.textContent = 'Press Space or Tap to Start';
    positionOverlay();
}

function positionOverlay() {
    const r = canvas.getBoundingClientRect();
    overlay.style.left = r.left + 'px';
    overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px';
    overlay.style.height = r.height + 'px';
}

function spawnFood() {
    let f;
    do {
        f = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    } while (snake.some(s => s.x === f.x && s.y === f.y));
    return f;
}

function start() {
    if (running) return;
    running = true;
    if (dx === 0 && dy === 0) { dx = 1; dy = 0; }
    overlay.style.display = 'none';
    gameLoop = setInterval(update, speed);
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        food = spawnFood();
        if (speed > 60) {
            speed -= 2;
            clearInterval(gameLoop);
            gameLoop = setInterval(update, speed);
        }
    } else {
        snake.pop();
    }
    draw();
}

function draw() {
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines faintly
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath(); ctx.moveTo(i * grid, 0); ctx.lineTo(i * grid, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * grid); ctx.lineTo(canvas.width, i * grid); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(food.x * grid + grid / 2, food.y * grid + grid / 2, grid / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
        const brightness = 1 - (i / snake.length) * 0.5;
        ctx.fillStyle = `hsl(120, 100%, ${40 * brightness + 20}%)`;
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = i === 0 ? 8 : 0;
        ctx.fillRect(seg.x * grid + 1, seg.y * grid + 1, grid - 2, grid - 2);
    });
    ctx.shadowBlur = 0;
}

function gameOver() {
    clearInterval(gameLoop);
    running = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHigh', highScore);
        highScoreEl.textContent = highScore;
    }
    overlay.style.display = 'flex';
    overlayText.textContent = `Game Over! Score: ${score}. Tap/Space to Restart`;
    positionOverlay();
    setTimeout(() => {
        snake = [{ x: 10, y: 10 }];
        food = spawnFood();
        dx = 0; dy = 0;
        score = 0;
        speed = 120;
        scoreEl.textContent = '0';
        draw();
    }, 500);
}

function changeDir(dir) {
    if (!running) { start(); return; }
    if (dir === 'up' && dy !== 1) { dx = 0; dy = -1; }
    else if (dir === 'down' && dy !== -1) { dx = 0; dy = 1; }
    else if (dir === 'left' && dx !== 1) { dx = -1; dy = 0; }
    else if (dir === 'right' && dx !== -1) { dx = 1; dy = 0; }
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); if (!running) { init(); start(); } }
    if (e.key === 'ArrowUp') { e.preventDefault(); changeDir('up'); }
    if (e.key === 'ArrowDown') { e.preventDefault(); changeDir('down'); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); changeDir('left'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); changeDir('right'); }
});

canvas.addEventListener('click', () => { if (!running) { init(); start(); } });
window.addEventListener('resize', positionOverlay);

init();

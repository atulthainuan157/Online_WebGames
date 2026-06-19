const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

let x, y, dx, dy, paddleX, rightPressed, leftPressed, score, lives, bricks, running, animationId;
const ballRadius = 8;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 15;

function init() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 3;
    dy = -3;
    paddleX = (canvas.width - paddleWidth) / 2;
    rightPressed = false;
    leftPressed = false;
    score = 0;
    lives = 3;
    running = false;

    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    updateUI();
    draw();
    overlay.style.display = 'flex';
    overlayText.textContent = 'Click or Tap to Start';
    positionOverlay();
}

function positionOverlay() {
    const r = canvas.getBoundingClientRect();
    overlay.style.left = r.left + 'px';
    overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px';
    overlay.style.height = r.height + 'px';
}

function updateUI() {
    scoreEl.textContent = score;
    livesEl.textContent = lives;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0ff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = `hsl(${c * 30 + r * 20}, 100%, 50%)`;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 10;
                    updateUI();
                    if (score === brickRowCount * brickColumnCount * 10) {
                        gameOver(true);
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    if (!running) return;
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            dx = 8 * ((x - (paddleX + paddleWidth / 2)) / paddleWidth);
        } else {
            lives--;
            updateUI();
            if (!lives) gameOver(false);
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3; dy = -3;
                paddleX = (canvas.width - paddleWidth) / 2;
                running = false;
                overlay.style.display = 'flex';
                overlayText.textContent = 'Click to Resume';
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    else if (leftPressed && paddleX > 0) paddleX -= 7;

    x += dx;
    y += dy;
    if (running) animationId = requestAnimationFrame(draw);
}

function gameOver(win) {
    running = false;
    cancelAnimationFrame(animationId);
    overlay.style.display = 'flex';
    overlayText.textContent = win ? `You Win! Score: ${score}\nClick to Restart` : `Game Over! Score: ${score}\nClick to Restart`;
}

document.addEventListener("keydown", e => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}, false);

document.addEventListener("keyup", e => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}, false);

canvas.addEventListener("mousemove", e => {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}, false);

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const relativeX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}, {passive: false});

canvas.addEventListener('click', () => {
    if (!running && lives > 0) {
        running = true;
        overlay.style.display = 'none';
        draw();
    } else if (!lives || score === brickRowCount * brickColumnCount * 10) {
        init();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!running && lives > 0) {
        running = true;
        overlay.style.display = 'none';
        draw();
    } else if (!lives || score === brickRowCount * brickColumnCount * 10) {
        init();
    }
}, {passive: false});

window.addEventListener('resize', positionOverlay);
init();

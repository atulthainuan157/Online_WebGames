const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const overlay = document.getElementById('overlay');
const msg = document.getElementById('msg');

let bird, pipes, score, best, running, frame, gravity, flapPower, pipeSpeed, pipeGap, pipeWidth, pipeInterval;

function init() {
    bird = { x: 80, y: 200, vy: 0, r: 14 };
    pipes = [];
    score = 0; frame = 0;
    gravity = 0.35; flapPower = -6; pipeSpeed = 2.5;
    pipeGap = 130; pipeWidth = 45; pipeInterval = 100;
    running = false;
    best = parseInt(localStorage.getItem('flappyBest') || '0');
    bestEl.textContent = best;
    scoreEl.textContent = '0';
    draw();
    overlay.style.display = 'flex';
    msg.textContent = 'Tap or Press Space to Start';
    posOverlay();
}

function posOverlay() {
    const r = canvas.getBoundingClientRect();
    overlay.style.left = r.left + 'px'; overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px'; overlay.style.height = r.height + 'px';
}

function flap() {
    if (!running) { running = true; overlay.style.display = 'none'; loop(); }
    bird.vy = flapPower;
}

function loop() {
    if (!running) return;
    update();
    draw();
    requestAnimationFrame(loop);
}

function update() {
    frame++;
    bird.vy += gravity;
    bird.y += bird.vy;

    if (frame % pipeInterval === 0) {
        const topH = 40 + Math.random() * (canvas.height - pipeGap - 80);
        pipes.push({ x: canvas.width, top: topH, passed: false });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;
        if (pipes[i].x + pipeWidth < 0) { pipes.splice(i, 1); continue; }
        if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
            pipes[i].passed = true;
            score++;
            scoreEl.textContent = score;
            if (score % 5 === 0) pipeSpeed += 0.3;
        }
        // Collision
        if (bird.x + bird.r > pipes[i].x && bird.x - bird.r < pipes[i].x + pipeWidth) {
            if (bird.y - bird.r < pipes[i].top || bird.y + bird.r > pipes[i].top + pipeGap) {
                die(); return;
            }
        }
    }

    if (bird.y + bird.r > canvas.height || bird.y - bird.r < 0) { die(); return; }
}

function draw() {
    // Sky gradient
    const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grd.addColorStop(0, '#1a1a3e');
    grd.addColorStop(1, '#0d0d1a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pipes
    pipes.forEach(p => {
        ctx.fillStyle = '#00cc66';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 6;
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, canvas.height - p.top - pipeGap);
        // Pipe caps
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(p.x - 3, p.top - 8, pipeWidth + 6, 8);
        ctx.fillRect(p.x - 3, p.top + pipeGap, pipeWidth + 6, 8);
    });
    ctx.shadowBlur = 0;

    // Bird
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.r, bird.y);
    ctx.lineTo(bird.x + bird.r + 8, bird.y + 3);
    ctx.lineTo(bird.x + bird.r, bird.y + 6);
    ctx.fill();
}

function die() {
    running = false;
    if (score > best) { best = score; localStorage.setItem('flappyBest', best); bestEl.textContent = best; }
    overlay.style.display = 'flex';
    msg.textContent = `Game Over! Score: ${score}\nTap/Space to Restart`;
    posOverlay();
    setTimeout(() => init(), 800);
}

document.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); flap(); } });
canvas.addEventListener('click', flap);
canvas.addEventListener('touchstart', e => { e.preventDefault(); flap(); }, { passive: false });
window.addEventListener('resize', posOverlay);
init();

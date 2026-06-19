const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

let fruits = [], particles = [], trails = [];
let score = 0, lives = 3;
let running = false;
let animationId;
let isDrawing = false;
const emojis = ['🍎', '🍌', '🍉', '🍇', '💣'];

function init() {
    fruits = []; particles = []; trails = [];
    score = 0; lives = 3;
    scoreEl.textContent = score; livesEl.textContent = lives;
    running = true;
    overlay.style.display = 'none';
    animate();
}

class Fruit {
    constructor() {
        this.x = Math.random() * (canvas.width - 100) + 50;
        this.y = canvas.height + 30;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = -(Math.random() * 5 + 10);
        this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
        this.isBomb = this.emoji === '💣';
        this.size = 40;
        this.slashed = false;
        this.rotation = 0;
        this.rotSpeed = (Math.random() - 0.5) * 0.2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity
        this.rotation += this.rotSpeed;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, 0, 0);
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.color = color;
        this.size = Math.random() * 5 + 2;
        this.life = 1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.life -= 0.05;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function animate() {
    if (!running) return;
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw trail
    if(trails.length > 0) {
        ctx.beginPath();
        ctx.moveTo(trails[0].x, trails[0].y);
        for(let i=1; i<trails.length; i++) ctx.lineTo(trails[i].x, trails[i].y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }

    if(Math.random() < 0.03) fruits.push(new Fruit());

    for (let i = fruits.length - 1; i >= 0; i--) {
        const f = fruits[i];
        f.update(); f.draw();
        
        // Missed fruit
        if (f.y > canvas.height + 50 && !f.slashed && !f.isBomb) {
            fruits.splice(i, 1);
            lives--;
            livesEl.textContent = lives;
            if(lives <= 0) gameOver();
        } else if (f.y > canvas.height + 50) {
            fruits.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(); particles[i].draw();
        if(particles[i].life <= 0) particles.splice(i, 1);
    }
}

function slash(x, y) {
    if(!running) { init(); return; }
    trails.push({x, y});
    if(trails.length > 10) trails.shift();

    for (let i = fruits.length - 1; i >= 0; i--) {
        const f = fruits[i];
        const dist = Math.hypot(f.x - x, f.y - y);
        if (dist < f.size && !f.slashed) {
            f.slashed = true;
            if(f.isBomb) {
                gameOver();
            } else {
                score++;
                scoreEl.textContent = score;
                fruits.splice(i, 1);
                // Create particles
                for(let j=0; j<10; j++) particles.push(new Particle(f.x, f.y, '#ff3333'));
            }
        }
    }
}

function handleStart(e) { e.preventDefault(); isDrawing = true; trails = []; }
function handleMove(e) {
    e.preventDefault();
    if(!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
    slash(x, y);
}
function handleEnd(e) { e.preventDefault(); isDrawing = false; trails = []; }

canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('mouseleave', handleEnd);

canvas.addEventListener('touchstart', handleStart, {passive: false});
canvas.addEventListener('touchmove', handleMove, {passive: false});
canvas.addEventListener('touchend', handleEnd, {passive: false});

function gameOver() {
    running = false;
    cancelAnimationFrame(animationId);
    overlay.style.display = 'flex';
    overlayText.textContent = `Game Over! Score: ${score}\nTap to Restart`;
    positionOverlay();
}

function positionOverlay() {
    const r = canvas.getBoundingClientRect();
    overlay.style.left = r.left + 'px'; overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px'; overlay.style.height = r.height + 'px';
}
window.addEventListener('resize', positionOverlay);
positionOverlay();

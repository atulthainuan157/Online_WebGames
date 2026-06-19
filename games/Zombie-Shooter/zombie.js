const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

let player, projectiles, enemies, particles, score, animationId, running, spawnInterval;

class Player {
    constructor(x, y, radius, color) {
        this.x = x; this.y = y; this.radius = radius; this.color = color;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fillStyle = this.color; ctx.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x; this.y = y; this.radius = radius; this.color = color; this.velocity = velocity;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fillStyle = this.color; ctx.fill();
    }
    update() {
        this.draw(); this.x += this.velocity.x; this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x; this.y = y; this.radius = radius; this.color = color; this.velocity = velocity;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fillStyle = this.color; ctx.fill();
    }
    update() {
        this.draw(); this.x += this.velocity.x; this.y += this.velocity.y;
    }
}

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x; this.y = y; this.radius = radius; this.color = color; this.velocity = velocity; this.alpha = 1;
    }
    draw() {
        ctx.save(); ctx.globalAlpha = this.alpha;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= 0.99; this.velocity.y *= 0.99;
        this.x += this.velocity.x; this.y += this.velocity.y;
        this.alpha -= 0.02;
    }
}

function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 10, '#fff');
    projectiles = []; enemies = []; particles = []; score = 0;
    scoreEl.textContent = score; running = true;
    overlay.style.display = 'none';
    spawnEnemies();
    animate();
}

function spawnEnemies() {
    spawnInterval = setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10;
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = { x: Math.cos(angle) * 1.5, y: Math.sin(angle) * 1.5 };
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

function animate() {
    if (!running) return;
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(42, 42, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) particles.splice(index, 1);
        else particle.update();
    });

    projectiles.forEach((proj, index) => {
        proj.update();
        if (proj.x + proj.radius < 0 || proj.x - proj.radius > canvas.width || 
            proj.y + proj.radius < 0 || proj.y - proj.radius > canvas.height) {
            setTimeout(() => projectiles.splice(index, 1), 0);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < 1) { // Game Over
            running = false; clearInterval(spawnInterval);
            overlay.style.display = 'flex';
            overlayText.textContent = `Game Over! Score: ${score}\nClick to Restart`;
            positionOverlay();
        }

        projectiles.forEach((proj, projIndex) => {
            const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
            if (dist - enemy.radius - proj.radius < 1) {
                // Explosions
                for(let i=0; i<enemy.radius*2; i++) {
                    particles.push(new Particle(proj.x, proj.y, Math.random()*2, enemy.color, {
                        x: (Math.random()-0.5)*(Math.random()*6), y: (Math.random()-0.5)*(Math.random()*6)
                    }));
                }
                
                if (enemy.radius - 10 > 10) {
                    score += 10;
                    enemy.radius -= 10;
                    setTimeout(() => projectiles.splice(projIndex, 1), 0);
                } else {
                    score += 25;
                    setTimeout(() => { enemies.splice(index, 1); projectiles.splice(projIndex, 1); }, 0);
                }
                scoreEl.textContent = score;
            }
        });
    });
}

function shoot(e) {
    if(!running) { init(); return; }
    let clientX, clientY;
    if(e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const angle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
    const velocity = { x: Math.cos(angle) * 6, y: Math.sin(angle) * 6 };
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, '#fff', velocity));
}

window.addEventListener('click', shoot);
window.addEventListener('touchstart', (e) => {
    if (e.target === canvas || overlay.style.display !== 'none') shoot(e);
}, {passive: false});

function positionOverlay() {
    const r = canvas.getBoundingClientRect();
    overlay.style.left = r.left + 'px'; overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px'; overlay.style.height = r.height + 'px';
}

window.addEventListener('resize', positionOverlay);
positionOverlay();

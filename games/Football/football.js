const container = document.getElementById('gameContainer');
const ball = document.getElementById('ball');
const gk = document.getElementById('goalkeeper');
const crosshair = document.getElementById('crosshair');
const msg = document.getElementById('message');
const goalsEl = document.getElementById('goals');
const attemptsEl = document.getElementById('attempts');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

let goals = 0, attempts = 0;
let isRunning = false;
let isShooting = false;
let mouseX = 0, mouseY = 0;

function init() {
    goals = 0; attempts = 0;
    goalsEl.textContent = goals; attemptsEl.textContent = attempts;
    isRunning = true;
    isShooting = false;
    overlay.style.display = 'none';
    resetPositions();
}

function resetPositions() {
    ball.style.transition = 'none';
    ball.style.bottom = '20px';
    ball.style.left = '50%';
    ball.style.transform = 'translateX(-50%) scale(1)';
    gk.style.left = '50%';
    gk.style.top = '80px';
    setTimeout(() => { ball.style.transition = 'all .5s cubic-bezier(0.25, 1, 0.5, 1)'; }, 50);
}

function showMessage(text, color) {
    msg.textContent = text;
    msg.style.color = color;
    msg.style.opacity = 1;
    setTimeout(() => msg.style.opacity = 0, 1500);
}

function shoot() {
    if(!isRunning || isShooting) return;
    isShooting = true;
    
    // gk dives
    const gkDive = (Math.random() * 60) + 20; // 20% to 80%
    gk.style.left = gkDive + '%';
    
    // ball goes to crosshair
    const containerRect = container.getBoundingClientRect();
    const bx = ((mouseX - containerRect.left) / containerRect.width) * 100;
    const by = ((mouseY - containerRect.top) / containerRect.height) * 100;
    
    ball.style.left = bx + '%';
    ball.style.top = by + '%';
    ball.style.transform = 'translate(-50%, -50%) scale(0.6)';
    
    setTimeout(() => {
        // Evaluate
        attempts++;
        attemptsEl.textContent = attempts;
        
        // Goal boundaries
        const inGoalX = bx > 20 && bx < 80;
        const inGoalY = by > 5 && by < 40;
        
        if(inGoalX && inGoalY) {
            // Check if GK saved
            const dist = Math.abs(bx - gkDive); // horizontal distance to gk
            if(dist < 15 && by > 15) { // if close and not too high
                showMessage('SAVED!', '#e74c3c');
            } else {
                showMessage('GOAL!', '#2ecc71');
                goals++;
                goalsEl.textContent = goals;
            }
        } else {
            showMessage('MISSED!', '#e67e22');
        }
        
        if(attempts >= 5) {
            setTimeout(() => {
                isRunning = false;
                overlay.style.display = 'flex';
                overlayText.textContent = `Game Over!\nGoals: ${goals}/5\nTap to Restart`;
            }, 1500);
        } else {
            setTimeout(() => {
                resetPositions();
                isShooting = false;
            }, 1500);
        }
    }, 500);
}

container.addEventListener('mousemove', e => {
    if(!isRunning || isShooting) return;
    mouseX = e.clientX; mouseY = e.clientY;
    crosshair.style.opacity = 1;
    const rect = container.getBoundingClientRect();
    crosshair.style.left = (e.clientX - rect.left) + 'px';
    crosshair.style.top = (e.clientY - rect.top) + 'px';
});
container.addEventListener('mouseleave', () => crosshair.style.opacity = 0);

container.addEventListener('click', e => {
    if(!isRunning) init();
    else {
        mouseX = e.clientX;
        mouseY = e.clientY;
        shoot();
    }
});

container.addEventListener('touchstart', e => {
    e.preventDefault();
    if(!isRunning) { init(); return; }
    if(isShooting) return;
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
    shoot();
}, {passive: false});

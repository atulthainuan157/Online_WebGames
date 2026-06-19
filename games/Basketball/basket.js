const container = document.getElementById('gameContainer');
const ball = document.getElementById('ball');
const hoopContainer = document.getElementById('hoopContainer');
const msg = document.getElementById('message');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

let score = 0, time = 30;
let isRunning = false;
let isShooting = false;
let hoopDir = 1;
let hoopPos = 50;
let hoopSpeed = 0.5;
let gameInterval, hoopInterval;

function init() {
    score = 0; time = 30;
    scoreEl.textContent = score; timeEl.textContent = time;
    isRunning = true;
    isShooting = false;
    hoopSpeed = 0.5;
    overlay.style.display = 'none';
    
    resetBall();
    
    clearInterval(gameInterval);
    clearInterval(hoopInterval);
    
    gameInterval = setInterval(() => {
        time--;
        timeEl.textContent = time;
        if(time <= 0) {
            isRunning = false;
            clearInterval(gameInterval);
            clearInterval(hoopInterval);
            overlay.style.display = 'flex';
            overlayText.textContent = `Time's Up!\nScore: ${score}\nTap to Restart`;
        }
    }, 1000);
    
    hoopInterval = setInterval(() => {
        if(!isRunning) return;
        hoopPos += hoopSpeed * hoopDir;
        if(hoopPos > 80 || hoopPos < 20) hoopDir *= -1;
        hoopContainer.style.left = hoopPos + '%';
    }, 20);
}

function resetBall() {
    ball.style.transition = 'none';
    ball.style.bottom = '20px';
    ball.style.left = '50%';
    ball.style.transform = 'translateX(-50%) scale(1)';
    setTimeout(() => { ball.style.transition = 'all .5s cubic-bezier(0.25, 1, 0.5, 1)'; }, 50);
}

function showMessage(text, color) {
    msg.textContent = text;
    msg.style.color = color;
    msg.style.opacity = 1;
    setTimeout(() => msg.style.opacity = 0, 1000);
}

function shoot() {
    if(!isRunning || isShooting) return;
    isShooting = true;
    
    // Shoot straight up
    ball.style.bottom = '400px';
    ball.style.transform = 'translateX(-50%) scale(0.5)';
    
    setTimeout(() => {
        if(Math.abs(hoopPos - 50) < 12) {
            showMessage('SWISH!', '#2ecc71');
            score += 2;
            scoreEl.textContent = score;
            hoopSpeed += 0.1; // Increase difficulty
            
            // animate ball going down net
            ball.style.zIndex = 2; // Behind front of hoop
            ball.style.bottom = '350px';
        } else {
            showMessage('BRICK!', '#e74c3c');
        }
        
        setTimeout(() => {
            resetBall();
            isShooting = false;
            ball.style.zIndex = 4;
        }, 500);
    }, 500);
}

container.addEventListener('click', () => {
    if(!isRunning) init();
    else shoot();
});

container.addEventListener('touchstart', e => {
    e.preventDefault();
    if(!isRunning) init();
    else shoot();
}, {passive: false});

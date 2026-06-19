const container = document.getElementById('gameContainer');
const ball = document.getElementById('ball');
const batsman = document.getElementById('batsman');
const msg = document.getElementById('message');
const scoreEl = document.getElementById('score');
const wicketsEl = document.getElementById('wickets');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

let score = 0, wickets = 0;
let isRunning = false;
let ballPos = -20;
let ballSpeed = 5;
let animationId;
let ballState = 'waiting'; // waiting, thrown, hit, missed

function init() {
    score = 0; wickets = 0;
    scoreEl.textContent = score; wicketsEl.textContent = wickets;
    isRunning = true;
    overlay.style.display = 'none';
    throwBall();
}

function throwBall() {
    if(!isRunning) return;
    ballState = 'thrown';
    ballPos = -20;
    ballSpeed = Math.random() * 4 + 6; // 6 to 10
    ball.style.display = 'block';
    ball.style.top = ballPos + 'px';
    animateBall();
}

function animateBall() {
    if(ballState !== 'thrown') return;
    ballPos += ballSpeed;
    ball.style.top = ballPos + 'px';
    
    // Bottom of pitch is 370px
    if(ballPos > 370) {
        // Missed
        ballState = 'missed';
        showMessage('OUT!', '#e74c3c');
        wickets++;
        wicketsEl.textContent = wickets;
        checkGameOver();
    } else {
        animationId = requestAnimationFrame(animateBall);
    }
}

function showMessage(text, color) {
    msg.textContent = text;
    msg.style.color = color;
    msg.style.opacity = 1;
    setTimeout(() => msg.style.opacity = 0, 1000);
}

function checkGameOver() {
    if(wickets >= 3) {
        isRunning = false;
        overlay.style.display = 'flex';
        overlayText.textContent = `Game Over!\nScore: ${score}\nTap to Restart`;
    } else {
        setTimeout(throwBall, 1500);
    }
}

function hit() {
    if(!isRunning || ballState !== 'thrown') return;
    
    batsman.classList.add('swing');
    setTimeout(() => batsman.classList.remove('swing'), 150);
    
    // Check timing
    // Perfect hit zone: 330 to 360
    if(ballPos >= 320 && ballPos <= 370) {
        ballState = 'hit';
        let runs = 0;
        let color = '#fff';
        let txt = '';
        
        if(ballPos >= 340 && ballPos <= 350) { runs = 6; txt = 'SIX!'; color = '#9b59b6'; }
        else if(ballPos >= 335 && ballPos <= 355) { runs = 4; txt = 'FOUR!'; color = '#3498db'; }
        else if(ballPos >= 330 && ballPos <= 360) { runs = 2; txt = 'Two Runs'; color = '#2ecc71'; }
        else { runs = 1; txt = 'One Run'; color = '#f1c40f'; }
        
        score += runs;
        scoreEl.textContent = score;
        showMessage(txt, color);
        
        // Animate ball flying away
        ball.style.top = '-50px';
        ball.style.left = (Math.random() * 100) + '%';
        
        setTimeout(() => {
            ball.style.display = 'none';
            ball.style.left = '50%';
            setTimeout(throwBall, 1000);
        }, 500);
    }
}

document.addEventListener('keydown', e => {
    if(e.code === 'Space') {
        e.preventDefault();
        if(!isRunning) init();
        else hit();
    }
});

container.addEventListener('mousedown', () => {
    if(!isRunning) init();
    else hit();
});
container.addEventListener('touchstart', e => {
    e.preventDefault();
    if(!isRunning) init();
    else hit();
}, {passive: false});

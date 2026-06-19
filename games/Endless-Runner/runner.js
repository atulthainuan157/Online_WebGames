const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const gameContainer = document.getElementById('gameContainer');

let isJumping = false;
let score = 0;
let highScore = parseInt(localStorage.getItem('runnerHigh') || '0');
highScoreEl.textContent = highScore;
let gameInterval, scoreInterval;
let running = false;
let speed = 1.5;

function init() {
    running = true;
    score = 0;
    speed = 1.5;
    scoreEl.textContent = score;
    obstacle.style.animation = 'none';
    obstacle.offsetHeight; /* trigger reflow */
    obstacle.style.animation = `moveAnim ${speed}s linear infinite`;
    overlay.style.display = 'none';
    
    scoreInterval = setInterval(() => {
        score++;
        scoreEl.textContent = score;
        if(score % 100 === 0 && speed > 0.8) {
            speed -= 0.1;
            obstacle.style.animation = `moveAnim ${speed}s linear infinite`;
        }
    }, 100);

    gameInterval = setInterval(checkCollision, 10);
}

function jump() {
    if(!running) { init(); return; }
    if(isJumping) return;
    isJumping = true;
    player.classList.add('jump');
    setTimeout(() => {
        player.classList.remove('jump');
        isJumping = false;
    }, 500);
}

function checkCollision() {
    const playerTop = parseInt(window.getComputedStyle(player).getPropertyValue('top'));
    const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    const containerWidth = gameContainer.offsetWidth;

    // Player left is fixed at 50, width is 30 -> right is 80
    // Obstacle width is 20
    if (obstacleLeft > 30 && obstacleLeft < 80 && playerTop >= 130) {
        // Collision
        running = false;
        obstacle.style.animation = 'none';
        player.style.animation = 'none';
        clearInterval(gameInterval);
        clearInterval(scoreInterval);
        
        if(score > highScore) {
            highScore = score;
            localStorage.setItem('runnerHigh', highScore);
            highScoreEl.textContent = highScore;
        }
        
        overlay.style.display = 'flex';
        overlayText.textContent = `Game Over!\nDistance: ${score}m\nTap to Restart`;
    }
}

document.addEventListener('keydown', e => {
    if(e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

gameContainer.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, {passive: false});
gameContainer.addEventListener('mousedown', jump);

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('final-score');
const gameOverScreen = document.getElementById('game-over-screen');
const startScreen = document.getElementById('start-screen');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoopTimeout;
let isPlaying = false;

highScoreElement.textContent = highScore;

// Initialize styles
const primaryColor = '#00ffcc'; // matches variables.css neon cyan
const secondaryColor = '#ff00ff'; // matches variables.css neon magenta
const snakeBodyColor = '#00cca3';

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    dx = 0;
    dy = -1;
    score = 0;
    scoreElement.textContent = score;
    placeFood();
    isPlaying = true;
    gameOverScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    
    if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
    gameLoop();
}

function gameLoop() {
    if (!isPlaying) return;
    
    update();
    draw();
    
    // Increase speed slightly as snake gets longer
    const speed = Math.max(50, 150 - (snake.length * 2));
    gameLoopTimeout = setTimeout(gameLoop, speed);
}

function update() {
    // Calculate new head position
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head); // Add new head
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        placeFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#05050a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw food
    ctx.shadowBlur = 10;
    ctx.shadowColor = secondaryColor;
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw snake
    ctx.shadowBlur = 5;
    ctx.shadowColor = primaryColor;
    
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? primaryColor : snakeBodyColor;
        // slightly smaller than grid size for gap effect
        ctx.fillRect(snake[i].x * gridSize + 1, snake[i].y * gridSize + 1, gridSize - 2, gridSize - 2);
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

function placeFood() {
    let validPos = false;
    while (!validPos) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        
        validPos = true;
        // make sure food doesn't spawn on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                validPos = false;
                break;
            }
        }
    }
}

function gameOver() {
    isPlaying = false;
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (!isPlaying) {
        if (e.code === 'Space' || e.code === 'Enter') {
             if (!startScreen.classList.contains('hidden') || !gameOverScreen.classList.contains('hidden')) {
                 initGame();
             }
        }
        return;
    }
    
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    
    switch(e.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

restartBtn.addEventListener('click', initGame);
startBtn.addEventListener('click', initGame);

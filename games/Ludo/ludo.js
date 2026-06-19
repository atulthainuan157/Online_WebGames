const boardEl = document.getElementById('board');
const rollBtn = document.getElementById('rollBtn');
const diceEl = document.getElementById('dice');
const statusEl = document.getElementById('status');

// simplified track: perimeter of 11x11 grid
const track = [];
for(let i=0; i<11; i++) track.push({r:0, c:i});
for(let i=1; i<11; i++) track.push({r:i, c:10});
for(let i=9; i>=0; i--) track.push({r:10, c:i});
for(let i=9; i>=1; i--) track.push({r:i, c:0});

const players = [
    {id: 'red', name: 'Red', color: '#ff4d4d', start: 0, pos: -1},
    {id: 'green', name: 'Green', color: '#4dff4d', start: 10, pos: -1},
    {id: 'yellow', name: 'Yellow', color: '#ffff4d', start: 20, pos: -1},
    {id: 'blue', name: 'Blue', color: '#4d4dff', start: 30, pos: -1}
];

let turn = 0;
let gameOver = false;

function init() {
    players.forEach(p => p.pos = -1); // -1 means home
    turn = 0;
    gameOver = false;
    updateStatus();
    render();
}

function render() {
    boardEl.innerHTML = '';
    // Draw 11x11
    for(let r=0; r<11; r++) {
        for(let c=0; c<11; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // Check if track
            let isTrack = track.findIndex(t => t.r === r && t.c === c);
            if(isTrack === -1) {
                // center block
                if(r>=1 && r<=4 && c>=1 && c<=4) cell.classList.add('home-red');
                if(r>=1 && r<=4 && c>=6 && c<=9) cell.classList.add('home-green');
                if(r>=6 && r<=9 && c>=6 && c<=9) cell.classList.add('home-yellow');
                if(r>=6 && r<=9 && c>=1 && c<=4) cell.classList.add('home-blue');
            }
            
            boardEl.appendChild(cell);
            
            // Add tokens
            players.forEach(p => {
                if(p.pos !== -1) {
                    const trackPos = (p.start + p.pos) % 40;
                    if(track[trackPos].r === r && track[trackPos].c === c) {
                        const token = document.createElement('div');
                        token.className = `token ${p.id}`;
                        cell.appendChild(token);
                    }
                } else {
                    // draw at home
                    let hr, hc;
                    if(p.id === 'red') { hr=2; hc=2; }
                    if(p.id === 'green') { hr=2; hc=7; }
                    if(p.id === 'yellow') { hr=7; hc=7; }
                    if(p.id === 'blue') { hr=7; hc=2; }
                    if(r===hr && c===hc) {
                        const token = document.createElement('div');
                        token.className = `token ${p.id}`;
                        cell.appendChild(token);
                    }
                }
            });
        }
    }
}

function updateStatus() {
    if(gameOver) return;
    statusEl.textContent = `${players[turn].name}'s Turn`;
    statusEl.style.color = players[turn].color;
}

rollBtn.addEventListener('click', () => {
    if(gameOver) return;
    
    rollBtn.disabled = true;
    let rolls = 0;
    let diceInterval = setInterval(() => {
        diceEl.textContent = Math.floor(Math.random() * 6) + 1;
        rolls++;
        if(rolls > 10) {
            clearInterval(diceInterval);
            const val = Math.floor(Math.random() * 6) + 1;
            diceEl.textContent = val;
            moveToken(val);
        }
    }, 50);
});

function moveToken(val) {
    const p = players[turn];
    
    if(p.pos === -1) {
        if(val === 6) p.pos = 0;
    } else {
        p.pos += val;
        if(p.pos >= 39) {
            gameOver = true;
            statusEl.textContent = `${p.name} Wins!`;
            render();
            rollBtn.textContent = 'Play Again';
            rollBtn.disabled = false;
            rollBtn.onclick = () => location.reload();
            return;
        }
        
        // Capture logic
        const currentAbsPos = (p.start + p.pos) % 40;
        players.forEach((otherP, idx) => {
            if(idx !== turn && otherP.pos !== -1) {
                const otherAbsPos = (otherP.start + otherP.pos) % 40;
                if(currentAbsPos === otherAbsPos) {
                    otherP.pos = -1; // sent home
                }
            }
        });
    }
    
    render();
    if(val !== 6 && !gameOver) turn = (turn + 1) % 4;
    updateStatus();
    rollBtn.disabled = false;
}

init();

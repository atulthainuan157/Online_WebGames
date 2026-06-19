const questions = [
    {q: "What is the capital of France?", options: ["Berlin", "London", "Paris", "Madrid"], ans: 2},
    {q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], ans: 1},
    {q: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], ans: 2},
    {q: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], ans: 3},
    {q: "In what year did World War II end?", options: ["1945", "1918", "1939", "1965"], ans: 0},
    {q: "Which element has the chemical symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Iron"], ans: 1},
    {q: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], ans: 2},
    {q: "How many continents are there?", options: ["5", "6", "7", "8"], ans: 2},
    {q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], ans: 1},
    {q: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], ans: 1},
    {q: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], ans: 1},
    {q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], ans: 2},
    {q: "What is the capital of Japan?", options: ["Beijing", "Seoul", "Bangkok", "Tokyo"], ans: 3},
    {q: "Which instrument has 88 keys?", options: ["Guitar", "Piano", "Violin", "Flute"], ans: 1},
    {q: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "1,000,000 km/s"], ans: 0}
];

let currentQuestions = [];
let currIndex = 0;
let score = 0;

const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const endScreen = document.getElementById('endScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const nextBtn = document.getElementById('nextBtn');
const qNumEl = document.getElementById('qNum');
const scoreEl = document.getElementById('score');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const finalScoreEl = document.getElementById('finalScore');

function startQuiz() {
    startScreen.classList.add('hide');
    endScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    
    // Select 10 random questions
    currentQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    currIndex = 0;
    score = 0;
    scoreEl.textContent = score;
    loadQuestion();
}

function loadQuestion() {
    nextBtn.classList.add('hide');
    qNumEl.textContent = currIndex + 1;
    const q = currentQuestions[currIndex];
    questionEl.textContent = q.q;
    
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = opt;
        div.addEventListener('click', () => selectOption(div, i, q.ans));
        optionsEl.appendChild(div);
    });
}

function selectOption(el, selectedIdx, correctIdx) {
    const allOptions = optionsEl.children;
    for(let i=0; i<allOptions.length; i++) {
        allOptions[i].classList.add('disabled');
        if(i === correctIdx) allOptions[i].classList.add('correct');
    }
    
    if(selectedIdx === correctIdx) {
        score++;
        scoreEl.textContent = score;
    } else {
        el.classList.add('wrong');
    }
    
    nextBtn.classList.remove('hide');
}

function nextQuestion() {
    currIndex++;
    if(currIndex < 10) {
        loadQuestion();
    } else {
        quizScreen.classList.add('hide');
        endScreen.classList.remove('hide');
        finalScoreEl.textContent = score;
    }
}

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);

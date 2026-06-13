let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
let user = document.querySelector("#user-score");
let comp = document.querySelector("#comp-score");

const generateCompChoice = () => {
    // rock, paper, scissor
    const options = ["rock", "paper", "scissor"];
    const idx = Math.floor(Math.random() * 3);
    return options[idx];
}

const drawGame = () => {
    msg.innerText = "Game was Draw! Play again";
    msg.style.backgroundColor = "yellow";
    msg.style.color = "black";
}

const showWinner = (userWin, userChoice, compChoice) => {
    if (userWin) {
        userScore++;
        user.innerText = userScore;
        msg.innerText = `You win! your ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "green";
    }
    else {
        compScore++;
        comp.innerText = compScore;
        msg.innerText = `You loose! ${compChoice} beats your ${userChoice}`;
        msg.style.backgroundColor = "red";
    }
}

const playGame = (userChoice) => {
    console.log("user choice : ", userChoice);
    // Generate computer choice
    const compChoice = generateCompChoice();
    console.log("computer choice : ", compChoice);
    if (userChoice === compChoice) {
        // Draw Game
        drawGame();
    }
    else {
        let userWin = true;
        if (userChoice === "rock") {
            userWin = (compChoice === "paper") ? false : true;
        }
        else if (userChoice === "paper") {
            userWin = (compChoice === "rock") ? true : false;
        }
        else {
            userWin = (compChoice === "rock") ? false : true;
        }
        showWinner(userWin, userChoice, compChoice);
    }
}

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id")
        playGame(userChoice);
    })
})
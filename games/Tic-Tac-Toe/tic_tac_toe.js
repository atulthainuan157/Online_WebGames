let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#resetBtn");
let newGameBtn = document.querySelector("#newGameBtn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true;   // playerX \ playerY

const winPattern = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
[0, 3, 6], [1, 4, 7], [2, 5, 8],
[0, 4, 8], [2, 4, 6]];

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turn0) {
            box.innerText = "O";
            box.style.color = "#ff0554"
            turn0 = false;
        }
        else {
            box.innerText = "X";
            box.style.color = "#140acc"
            turn0 = true;
        }
        box.disabled = true;

        checkWinner();
    })
})

const checkWinner = () => {
    for (let pattern of winPattern) {

        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                disabledBoxes();
            }
        }
    }
}


const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is : ${winner}`;
    msgContainer.classList.remove("hide");
    newGameBtn.classList.remove("hide");
}

const disabledBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}
const resetGame = () => {
    turn0 = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    newGameBtn.classList.add("hide");
}


newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
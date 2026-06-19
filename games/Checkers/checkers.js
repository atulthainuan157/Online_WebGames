let white = document.querySelectorAll(".box");

for (let i = 0; i <= 64;) {
    white[i].innerHTML = "O";
    white[i].style.color = "red"
    white[i].style.fontSize = "50px"
    if (i % 2 == 0) {
        i++;
    }
    else {
        i = i + 7;
    }
}
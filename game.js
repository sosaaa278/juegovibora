const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const size = 10;
let snake = [{ x: 150, y: 150 }];
let food = randomFood();
let dx = size;
let dy = 0;
let score = 0;

function randomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / size)) * size,
        y: Math.floor(Math.random() * (canvas.height / size)) * size
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, size, size);

    // snake
    ctx.fillStyle = "lime";
    snake.forEach(p => ctx.fillRect(p.x, p.y, size, size));

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        food = randomFood();
    } else {
        snake.pop();
    }

    if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        snake.slice(1).some(p => p.x === head.x && p.y === head.y)
    ) {
        resetGame();
    }
}

function resetGame() {
    snake = [{ x: 150, y: 150 }];
    dx = size;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
}

function changeDirection(dir) {
    if (dir === "up" && dy === 0) { dx = 0; dy = -size; }
    if (dir === "down" && dy === 0) { dx = 0; dy = size; }
    if (dir === "left" && dx === 0) { dx = -size; dy = 0; }
    if (dir === "right" && dx === 0) { dx = size; dy = 0; }
}

document.addEventListener(
    "touchstart",
    function (e) {
        const target = e.target;
        if (target.dataset && target.dataset.dir) {
            e.preventDefault();
            changeDirection(target.dataset.dir);
        }
    },
    { passive: false }
);


/* 🔥 CONTROLES TÁCTILES (ESTO ES LA CLAVE) */
document.querySelectorAll(".controls button").forEach(btn => {
    btn.addEventListener(
        "touchstart",
        e => {
            e.preventDefault();
            changeDirection(btn.dataset.dir);
        },
        { passive: false }
    );
});

/* Teclado (PC) */
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") changeDirection("up");
    if (e.key === "ArrowDown") changeDirection("down");
    if (e.key === "ArrowLeft") changeDirection("left");
    if (e.key === "ArrowRight") changeDirection("right");
});

setInterval(draw, 120);

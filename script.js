const board = document.querySelector(".board");
const blockHeight = 30;
const blockWidth = 30;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

const blocks = [];
const snake = [{ x: 3, y: 3 }];

let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
document.querySelector("#high-score").textContent = highScore;
document.querySelector("#score").textContent = score;

let direction = "right";

const food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.append(block);
    blocks[`${i},${j}`] = block;
  }
}

function rendor() {
  Object.values(blocks).forEach((block) => {
    block.classList.remove("fill", "head", "food");
  });

  snake.forEach((segment, index) => {
    const cell = blocks[`${segment.x},${segment.y}`];

    if (index === 0) {
      cell.classList.add("head");
    } else {
      cell.classList.add("fill");
    }
  });

  blocks[`${food.x},${food.y}`].classList.add("food");
}

setInterval(() => {
  let head = null;

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    food.x = Math.floor(Math.random() * rows);
    food.y = Math.floor(Math.random() * cols);

    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.querySelector("#high-score").textContent = highScore;
    }
    document.querySelector("#score").textContent = score;
  } else {
    snake.pop();
  }
  rendor();
}, 300);

addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    direction = "left";
  } else if (event.key === "ArrowRight") {
    direction = "right";
  } else if (event.key === "ArrowUp") {
    direction = "up";
  } else if (event.key === "ArrowDown") {
    direction = "down";
  }
});

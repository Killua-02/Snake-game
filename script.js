const board = document.querySelector(".board");
const startGameBtn = document.querySelector("#start-button");
const restartGameBtn = document.querySelector("#restart-button");
const startScreen = document.querySelector(".start-game");
const restartScreen = document.querySelector(".game-over");
const blockHeight = 30;
const blockWidth = 30;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

const blocks = [];
const snake = [{ x: 3, y: 3 }];

// Initialize score and high score
let speed = 400;
let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
document.querySelector("#high-score").textContent = highScore;
document.querySelector("#score").textContent = score;

let timer = "00:00";
let direction = "right";
let lastDirection = "right";
let intervalId = null;
let timeIntervalId = null;

// Food object with random position
let food = generateFood();
function generateFood() {
  let food = {};
  do {
    food.x = Math.floor(Math.random() * rows);
    food.y = Math.floor(Math.random() * cols);
  } while (
    snake.some((segment) => food.x === segment.x && food.y === segment.y)
  );
  return food;
}

// Create the grid and store references to each block
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.append(block);
    blocks[`${i},${j}`] = block;
  }
}

// Function to render the snake and food on the board
function render() {
  // Clear previous snake and food classes
  for (let key in blocks) {
    blocks[key].classList.remove("fill", "head", "food");
  }

  // Render the snake segments
  snake.forEach((segment, index) => {
    const cell = blocks[`${segment.x},${segment.y}`];

    // Add "head" class to the first segment and "fill" class to the rest
    if (index === 0) {
      cell.classList.add("head");
    } else {
      cell.classList.add("fill");
    }
  });

  blocks[`${food.x},${food.y}`].classList.add("food");
}

// Start the game loop
function gameLoop() {
  let head = null;

  // Update the head position based on the current direction
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  // Check for collisions with walls
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    gameOver();
    return;
  }

  // Check for collisions with itself
  if (snake.some((segment) => head.x === segment.x && head.y === segment.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Check if the snake has eaten the food
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    food = generateFood();
    // food.x = Math.floor(Math.random() * rows);
    // food.y = Math.floor(Math.random() * cols);

    // Update score and high score
    score++;
    if (score % 5 === 0 && speed > 100) {
      speed -= 50;
      clearInterval(intervalId);
      intervalId = setInterval(gameLoop, speed);
    }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.querySelector("#high-score").textContent = highScore;
    }
    document.querySelector("#score").textContent = score;
  } else {
    snake.pop();
  }
  lastDirection = direction;
  render();
}

// Timer loop to update the timer every second
function timerLoop() {
  let [min, sec] = timer.split(":").map(Number);
  sec++;
  if (sec === 60) {
    min++;
    sec = 0;
  }
  timer = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  document.querySelector("#time").textContent = timer;
}

// Start the game when the start button is clicked
startGameBtn.addEventListener("click", () => {
  let speed = 400;
  intervalId = setInterval(gameLoop, speed);
  startScreen.classList.add("hidden");
  timeIntervalId = setInterval(timerLoop, 1000);
});

// Function to handle game over state
function gameOver() {
  clearInterval(intervalId);
  clearInterval(timeIntervalId);
  restartScreen.classList.remove("hidden");
}

restartGameBtn.addEventListener("click", () => {
  //clear intervals and reset game state
  clearInterval(intervalId);
  clearInterval(timeIntervalId);
  // Reset score, timer
  score = 0;
  timer = "00:00";
  document.querySelector("#score").textContent = score;
  document.querySelector("#time").textContent = timer;
  // Reset direction
  direction = "right";
  lastDirection = "right";
  // Reset snake position
  snake.length = 0;
  snake.push({ x: 3, y: 3 });
  // Reset food position
  food = generateFood();
  // food.x = Math.floor(Math.random() * rows);
  // food.y = Math.floor(Math.random() * cols);

  restartScreen.classList.add("hidden");

  intervalId = setInterval(gameLoop, speed);
  timeIntervalId = setInterval(timerLoop, 1000);
});

// Listen for arrow key presses to change the snake's direction
addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && lastDirection !== "right") {
    direction = "left";
  } else if (event.key === "ArrowRight" && lastDirection !== "left") {
    direction = "right";
  } else if (event.key === "ArrowUp" && lastDirection !== "down") {
    direction = "up";
  } else if (event.key === "ArrowDown" && lastDirection !== "up") {
    direction = "down";
  }
});

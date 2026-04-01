const board = document.querySelector(".board");
const blockHeight = 30;
const blockWidth = 30;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

const blocks = [];
const snake = [{ x: 3, y: 3 }];

// Initialize score and high score
let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
document.querySelector("#high-score").textContent = highScore;
document.querySelector("#score").textContent = score;

let direction = "right";
let lastDirection="right";
let intervalId = null;

// Food object with random position
const food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

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
  Object.values(blocks).forEach((block) => {
    block.classList.remove("fill", "head", "food");
  });

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
intervalId=setInterval(() => {
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
  if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
    clearInterval(intervalId);
    alert('Game Over!');
    return;
  }

  // Check for collisions with itself
  snake.some((segment)=>{
    if (head.x === segment.x && head.y === segment.y) {
      clearInterval(intervalId);
      alert('Game Over!');
      return; // Exit the loop early
    }
  });

  snake.unshift(head);

  // Check if the snake has eaten the food
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    food.x = Math.floor(Math.random() * rows);
    food.y = Math.floor(Math.random() * cols);

    // Update score and high score
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
  lastDirection = direction;
  render();
}, 200);

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


const dino = document.getElementById("dino");
const gameContainer = document.getElementById("game-container");
const timerElement = document.getElementById("timer");
const gameOverElement = document.getElementById("game-over");
const scoreElement = document.getElementById("score");
let isJumping = false;
let isGameOver = true;
let cactusInterval;
let seconds = 0;
let score = 0;

function startGame() {
  if (!isJumping && isGameOver) {
    isGameOver = false;
    cactusInterval = setInterval(createCactus, 1500);
    gameOverElement.style.display = "none";
    score = 0;
    scoreElement.innerText = "Score: 0";
  }
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    startGame();
    if (!isJumping) {
      isJumping = true;
      jump();
    }
  }
});

function jump() {
  let position = 0;
  const jumpInterval = setInterval(function () {
    if (position === 180) {
      clearInterval(jumpInterval);
      let downInterval = setInterval(function () {
        if (position === 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= 10;
        if (position < 0) {
          position = 0;
        }
        dino.style.bottom = position + "px";
      }, 20);
    }
    position += 10;
    dino.style.bottom = position + "px";
  }, 20);
}

function createCactus() {
  const newCactus = document.createElement("div");
  newCactus.classList.add("cactus");
  gameContainer.appendChild(newCactus);
  const containerHeight = gameContainer.offsetHeight;
  newCactus.style.bottom = "0";
  newCactus.style.left = 870 + "px";

  moveCactus(newCactus);
}

function moveCactus(cactusElement) {
  const cactusSpeed = 5;
  let cactusPosition = parseInt(cactusElement.style.left);

  const moveInterval = setInterval(function () {
    if (cactusPosition === 0) {
      clearInterval(moveInterval);
      cactusElement.remove();
    }
    cactusPosition -= cactusSpeed;
    cactusElement.style.left = cactusPosition + "px";

    checkCollision(cactusElement);
  }, 20);
}

function checkCollision(cactusElement) {
  const dinoRect = dino.getBoundingClientRect();
  const cactusRect = cactusElement.getBoundingClientRect();

  if (
    dinoRect.bottom >= cactusRect.top &&
    dinoRect.left + dinoRect.width >= cactusRect.left &&
    dinoRect.left <= cactusRect.left + cactusRect.width
  ) {
    gameOver();
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(cactusInterval);
  gameOverElement.style.display = "block";
  scoreElement.style.display = "block";
  scoreElement.innerText = "Score: " + score;
  dino.style.bottom = "0";
  document.querySelectorAll(".cactus").forEach((cactus) => {
    cactus.remove();
  });
  seconds = 0;
  timerElement.style.display = "none";
}

setInterval(function () {
  if (!isGameOver) {
    seconds++;
    timerElement.innerText = seconds + "s";
    timerElement.style.display = "block";
    score++;
  }
}, 1000);

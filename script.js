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
const cactusSpeed = 5;
const jumpHeight = 185;
const jumpStep = 10;
const cactusSpawnInterval = 1500;

function startGame() {
  if (!isJumping && isGameOver) {
    isGameOver = false;
    cactusInterval = setInterval(createCactus, cactusSpawnInterval);
    gameOverElement.style.display = "none";
    score = 0;
    updateScore();
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
    if (position === jumpHeight) {
      clearInterval(jumpInterval);
      let downInterval = setInterval(function () {
        if (position === 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= jumpStep;
        if (position < 0) {
          position = 0;
        }
        dino.style.bottom = position + "px";
      }, 20);
    }
    position += jumpStep;
    dino.style.bottom = position + "px";
  }, 20);
}

function createCactus() {
  const newCactus = document.createElement("div");
  newCactus.classList.add("cactus");
  gameContainer.appendChild(newCactus);
  const containerHeight = gameContainer.offsetHeight;
  newCactus.style.bottom = "0";
  newCactus.style.left = gameContainer.offsetWidth + "px";

  moveCactus(newCactus);
}

function moveCactus(cactusElement) {
  let cactusPosition = parseInt(cactusElement.style.left);

  const moveInterval = setInterval(function () {
    if (cactusPosition <= 0) {
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
  updateScore();
  dino.style.bottom = "0";
  document.querySelectorAll(".cactus").forEach((cactus) => {
    cactus.remove();
  });
  seconds = 0;
  timerElement.style.display = "none";
}

function updateScore() {
  scoreElement.innerText = "Score: " + score;
}

setInterval(function () {
  if (!isGameOver) {
    ++seconds;
    timerElement.innerText = seconds + "s";
    timerElement.style.display = "block";
    ++score;
    updateScore();
  }
}, 1000);

const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = null;
let secondCard = null;

// Items array
const items = [
  { name: "bee", image: "images/bee.png" },
  { name: "crocodile", image: "images/crocodile.png" },
  { name: "macaw", image: "images/macaw.png" },
  { name: "gorilla", image: "images/gorilla.png" },
  { name: "tiger", image: "images/tiger.png" },
  { name: "monkey", image: "images/monkey.png" },
  { name: "chameleon", image: "images/chameleon.png" },
  { name: "piranha", image: "images/piranha.png" },
  { name: "anaconda", image: "images/anaconda.png" },
  { name: "sloth", image: "images/sloth.png" },
  { name: "cockatoo", image: "images/cockatoo.png" },
  { name: "toucan", image: "images/toucan.png" },
  { name: "penguin", image: "images/penguin.png" },
  { name: "butterfly", image: "images/butterfly.png" },
];

let currentLevel = 0; // Current level
let maxLevels = 2; // Number of levels
let gridSize = 2; // Start with a 4x4 grid

// Initial Time
let seconds = 0, minutes = 0;


// Initial moves and win count
let movesCount = 0, winCount = 0;

// Timer function
const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// Move counter function
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Pick random objects from the items array
const generateRandom = (size) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2; // Half for pairs
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

// Matrix generator function
const matrixGenerator = (cardValues, size) => {
  gameContainer.innerHTML = ""; // Clear previous grid
  cardValues = [...cardValues, ...cardValues]; // Create pairs
  cardValues.sort(() => Math.random() - 0.5); // Shuffle cards
  
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
          <img src="${cardValues[i].image}" class="image"/>
        </div>
      </div>
    `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

  //attach event listeners to cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue === secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = null;
            winCount += 1;

            //moving to next level
            if (winCount === Math.floor(cardValues.length / 2)) {
              if (currentLevel < maxLevels - 1) {
                currentLevel++;
                gridSize += 2; //increase in size
                result.innerHTML = `<h2>Level ${currentLevel} Complete!</h2>`;
              } else {
                result.innerHTML = `<h2>Congratulations! You've completed all levels!</h2>`;
              }
              stopGame();
            }
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = null;
            secondCard = null;
            setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");

  interval = setInterval(timeGenerator, 1000);

  
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

// Stop game
stopButton.addEventListener("click", stopGame = () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
});

// Initialize values and functions
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom(gridSize);
  matrixGenerator(cardValues, gridSize);
};

// Start the game for the first time
initializer();
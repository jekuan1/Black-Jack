/**
 * TODO FEATURES:
 * CONTINUE BUTTON THAT CONTINUES WITH DECK RATHER THAN NEW GAME WITH NEW DECK
 * PLAYER MUST START A NEW GAME IF DECK IS EMPTY
 * CONFIRMATINO ASKING ARE YOU SURE YOU WANT TO START A NEW GAME IF PLAYER HAS OPTION TO RESUME
 * PRACTICE MODE
 * SETTINGS SO YOU CAN EDIT HOW MANY DECKS ARE IN PLAY
 */
//Card variables
let suits = ["hearts", "clubs", "diamonds", "spades"],
  values = [
    "ace",
    "king",
    "queen",
    "jack",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];

//DOM variables
let textArea = document.getElementById("text-area"),
  newGameButton = document.getElementById("new-game-button"),
  hitButton = document.getElementById("hit-button"),
  stayButton = document.getElementById("stay-button");
homeButton = document.getElementById("home-button");
resumeGameButton = document.getElementById("resume-game-button");
gameStatus = document.getElementById("game-status");
settings = document.getElementById("settings");
practice = document.getElementById("practice");
nextCard = document.getElementById("next-card");

document.querySelectorAll("h1").forEach(function (h1) {
  h1.style.display = "none";
});

//Game variables
let gameStarted = false,
  gameOver = false,
  winner = "dealer",
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

hitButton.style.display = "none";
stayButton.style.display = "none";
homeButton.style.display = "none";
resumeGameButton.style.display = "none";
gameStatus.style.display = "none";
textArea.style.display = "none";
nextCard.style.display = "none";
showStatus();

settings.addEventListener("click", function () {
  settings.innerText = "To do";
});

practice.addEventListener("click", function () {
  settings.style.display = "none";
  newGameButton.style.display = "none";
  homeButton.style.display = "inline";
  practice.style.display = "none";
  resumeGameButton.style.display = "none";
  nextCard.style.display = "block";
  document.getElementById("cards-practice").style.display = "block";
  deck = createDeck();
  shuffleDeck(deck);
  count = 0;

  // TODO FIX THIS DECK DRAW METHOD
  function drawForPractice() {
    card = getNextCard();
    count += countCard(card);
    console.log(count);
    let items = document.getElementsByClassName("practice-card");
    if (items.length > 0) {
      items[0].remove();
    }
    let svg = new Image();
    svg.src = "card-images/" + getCardString(card) + ".svg";
    svg.classList.add("practice-card");
    document.getElementById("cards-practice").appendChild(svg);
  }

  drawForPractice();

  nextCard.addEventListener("click", function () {
    drawForPractice();
  });
});

newGameButton.addEventListener("click", function () {
  gameStarted = true;
  gameOver = false;
  dealerCards = [];
  playerCards = [];
  dealerScore = 0;
  playerScore = 0;
  winner = "dealer";
  gameStatus.innerText = "";
  gameStatus.style.display = "none";

  const playerCardVisuals = document.getElementById("player-cards");
  playerCardVisuals.innerHTML = "";

  const dealerCardVisuals = document.getElementById("dealer-cards");
  dealerCardVisuals.innerHTML = "";

  document.querySelectorAll("h1").forEach(function (h1) {
    h1.style.display = "block";
  });

  deck = createDeck();
  shuffleDeck(deck);
  playerHit();
  playerHit();
  faceDownDeal();
  dealerHit();

  document.getElementById("dealer-cards").style.display = "block";
  document.getElementById("player-cards").style.display = "block";
  homeButton.style.display = "inline";
  newGameButton.style.display = "none";
  resumeGameButton.style.display = "none";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  // textArea.style.display = "block";
  textArea.style.display = "none";
  settings.style.display = "none";
  practice.style.display = "none";

  showStatus();
  checkForEndOfGame();
});

hitButton.addEventListener("click", function () {
  playerHit();
  checkForEndOfGame();
});

stayButton.addEventListener("click", function () {
  playerStand();
});

homeButton.addEventListener("click", function () {
  document.getElementById("text-area").innerHTML = "Welcome to Blackjack!";
  document.getElementById("home-button").style.display = "none";
  document.getElementById("new-game-button").style.display = "block";
  if (gameStarted && !gameOver) {
    document.getElementById("resume-game-button").style.display = "inline";
  }
  document.getElementById("dealer-cards").style.display = "none";
  document.getElementById("player-cards").style.display = "none";
  document.getElementById("hit-button").style.display = "none";
  document.getElementById("stay-button").style.display = "none";
  nextCard.style.display = "none";
  practice.style.display = "block";
  settings.style.display = "block";
  textArea.style.display = "none";
  gameStatus.style.display = "none";
  document.querySelectorAll("h1").forEach(function (h1) {
    h1.style.display = "none";
  });
  document.getElementById("cards-practice").style.display = "none";
});

resumeGameButton.addEventListener("click", function () {
  homeButton.style.display = "inline";
  newGameButton.style.display = "none";
  resumeGameButton.style.display = "none";
  document.getElementById("dealer-cards").style.display = "block";
  document.getElementById("player-cards").style.display = "block";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  settings.style.display = "none";
  practice.style.display = "none";
  textArea.style.display = "block";
  showStatus();
  checkForEndOfGame();
});

function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx],
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let randomIndex = Math.trunc(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = temp;
  }
}

function getCardString(card) {
  return card.value + "_of_" + card.suit;
}

function getNextCard() {
  return deck.shift();
}

function countCard(card) {
  let value = parseInt(getCardNumericValue(card));
  if (value >= 2 && value <= 6) {
    return 1;
  } else if (value >= 7 && value <= 9) {
    return 0;
  } else {
    return -1;
  }
}

function getCardNumericValue(card) {
  if (card.value === "ace") {
    return 1;
  }
  if (card.value === "king") {
    return 10;
  }
  if (card.value === "queen") {
    return 10;
  }
  if (card.value === "jack") {
    return 10;
  }
  return card.value;
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += parseInt(getCardNumericValue(card));
    if (card.value === "ace") {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function playerHit() {
  playerCards.push(getNextCard());
  let svg = new Image();
  svg.src =
    "card-images/" +
    getCardString(playerCards[playerCards.length - 1]) +
    ".svg";
  svg.classList.add("svg-image");
  document.getElementById("player-cards").appendChild(svg);

  updateScores();
  showStatus();
  // checkForEndOfGame();
}

function faceDownDeal() {
  dealerCards.push(getNextCard());
  let svg = new Image();
  svg.classList.add("face-down-svg");
  svg.src = "card-images/face_down_card.svg";
  document.getElementById("dealer-cards").prepend(svg);
}

function dealerHit() {
  dealerCards.push(getNextCard());
  let svg = new Image();
  svg.src =
    "card-images/" +
    getCardString(dealerCards[dealerCards.length - 1]) +
    ".svg";
  svg.classList.add("svg-image");
  document.getElementById("dealer-cards").appendChild(svg);
  updateScores();
}

function dealerReveal() {
  let items = document.getElementsByClassName("face-down-svg");
  items[0].remove();
  let svg = new Image();
  svg.classList.add("svg-image");
  svg.src = "card-images/" + getCardString(dealerCards[0]) + ".svg";
  document.getElementById("dealer-cards").prepend(svg);
}

// redo
function checkForEndOfGame() {
  /**
   * END OF GAME RULES:
   * Player is over 21:
   * Dealer doesn't hit
   * Game ends
   * Player Loses √
   *
   * Player is at 21:
   * Dealer hits until at or over 21
   * Check if dealer hits 21, if so game pushes
   * if over 21 player wins √
   *
   * Player is below 21:
   * Dealer hits until at or over 17
   * Dealer is above 21: Dealer loses
   * Dealer is above player: Player loses
   */
  if (playerScore > 21) {
    winner = "dealer";
    gameOver = true;
    showStatus();
    return;
  }

  if (playerScore === 21) {
    gameOver = true;
    while (dealerScore < 17) {
      dealerHit();
      updateScores();
    }
    if (dealerScore === 21) {
      winner = "tie";
      showStatus();
    } else {
      winner = "player";
      showStatus();
    }
    gameOver = true;
    return;
  }
}

function playerStand() {
  // STAND SCENARIO
  if (dealerScore < playerScore) {
    // DEALER STANDS ALL 17s
    while (dealerScore < 17) {
      dealerHit();
      updateScores();
    }
    if (dealerScore > 21 || playerScore > dealerScore) {
      winner = "player";
    } else {
      winner = "dealer";
    }
  }
  if (dealerScore === playerScore) {
    winner = "tie";
  }
  gameOver = true;
  showStatus();
}

function showStatus() {
  // create a display card method and call it in a different section of code, this solution suckkkkksss.
  let dealerCardString = "";
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + "\n";
  }

  let playerCardString = "";
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + "\n";
  }

  textArea.innerText = (
    "Dealer has:\n" +
    dealerCardString +
    "(score: " +
    dealerScore +
    ")\n\n" +
    "Player has:\n" +
    playerCardString +
    "(score: " +
    playerScore +
    ")\n\n"
  ).replaceAll("_", " ");
  if (gameOver) {
    dealerReveal();
    if (winner === "player") {
      gameStatus.innerText = "YOU WIN!";
      gameStatus.style.backgroundColor = "green";
    } else if (winner === "dealer") {
      gameStatus.innerText = "DEALER WINS";
      gameStatus.style.backgroundColor = "red";
    } else {
      gameStatus.innerText = "TIE";
      gameStatus.style.backgroundColor = "#444";
    }
    gameStatus.style.display = "block";
    newGameButton.style.display = "inline";
    hitButton.style.display = "none";
    stayButton.style.display = "none";
  }
}

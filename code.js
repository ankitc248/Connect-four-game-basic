const connectBlocks = document.getElementsByClassName("connect-block");
const timerBtn = document.getElementsByClassName("timer")[0];
const timeField = document.getElementsByClassName("remaining-time")[0];
const turnIndicator = document.getElementsByClassName("turn-indicator")[0];
const playerOneScoreField = document.getElementById("playerOneScore");
const playerTwoScoreField = document.getElementById("playerTwoScore");
const playerOneEye = document.querySelector(".player-one .eyes");
const playerTwoEye = document.querySelector(".player-two .eyes");
const playerOneMouth = document.querySelector(".player-one .mouth");
const playerTwoMouth = document.querySelector(".player-two .mouth");
const maxTime = 5;
const board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
const boardWidth = 7;
const boardHeight = 6;

let countDownInterval = "";
let timer = maxTime;
let gameStatus = 0; //0 for game not started yet, 1 for player 1 wins, 2 for player 2 wins, 3 for tie
let turn = 0; //0 for player 1,1 for player 2
let noOfBlocksDone = 0;
let playerOneBlocks = 0;
let playerTwoBlocks = 0;
timerBtn.addEventListener("click", function () {
  StartGame();
});

function StartGame() {
  if (!gameStatus) {
    timeField.innerText = timer + "s";
    Array.from(connectBlocks).forEach((block, index) => {
      let blockPosition = index + 1;
      block.classList.add("active-block");
      block.addEventListener("click", function () {
        if (noOfBlocksDone == boardHeight*boardWidth) {
          gameStatus = 3;
          endGame();
          return;
        }
        this.classList.add("filled-block");
        let childElement = this.getElementsByTagName("span")[0];
        if (turn) {
          childElement.classList.add("player-two-block");
          ++playerOneBlocks;
          playerTwoScoreField.innerText = playerTwoBlocks;
        } else {
          childElement.classList.add("player-one-block");
          ++playerTwoBlocks;
          playerOneScoreField.innerText = playerOneBlocks;
        }
        ++noOfBlocksDone;
        let row = parseInt(blockPosition / boardWidth);
        let column = blockPosition % boardWidth;
        if (column == 0) {
          column = boardWidth;
          row--;
        }
        board[row][column - 1] = turn + 1;
        if (areFourConnected(turn + 1)) {
          let winningBlocks = areFourConnected(turn+1);
          console.log(winningBlocks);
          gameStatus = turn + 1;
          endGame();
          return;
        }
        endTurn();
      });
    });
    timerBtn.style.pointerEvents = "none";
    gameStatus = 1;
  }
  countDownInterval = setInterval(CountDown, 1000);
}
function changeHoverColor() {
  Array.from(connectBlocks).forEach((block) => {
    if (!turn) {
      block.classList.add("player-one-hover");
      block.classList.remove("player-two-hover");
    } else {
      block.classList.remove("player-one-hover");
      block.classList.add("player-two-hover");
    }
  });
}
function endGame() {
  let smallText = "Game ended";
  let bigText = "TIE";
  let backgroundColor = "#333";
  if (gameStatus == 1) {
    bigText = "P1 Wins";
    backgroundColor = "var(--pink-color)";
    playerOneEye.classList.add('winner-eyes');
    playerOneMouth.classList.add('winner-mouth');
    playerTwoEye.classList.add('loser-eyes');
    playerTwoMouth.classList.add('loser-mouth');
  } else if (gameStatus == 2) {
    bigText = "P2 Wins";
    backgroundColor = "var(--yellow-color)";
    playerTwoEye.classList.add('winner-eyes');
    playerTwoMouth.classList.add('winner-mouth');
    playerOneEye.classList.add('loser-eyes');
    playerOneMouth.classList.add('loser-mouth');
  } else if (gameStatus == 3) {
    bigText = "Tie";
    playerTwoEye.classList.add('loser-eyes');
    playerTwoMouth.classList.add('loser-mouth');
    playerOneEye.classList.add('loser-eyes');
    playerOneMouth.classList.add('loser-mouth');
  }
  clearInterval(countDownInterval);
  turnIndicator.innerText = smallText;
  timeField.innerText = bigText;
  timerBtn.style.backgroundColor = backgroundColor;
  timerBtn.style.pointerEvents = "none";
  Array.from(connectBlocks).forEach((block) => {
    block.classList.remove("active-block");
  });
}

function endTurn() {
  if (noOfBlocksDone == boardHeight*boardWidth) {
    gameStatus=3;
    endGame();
    return;
  }
  if (turn) {
    turnIndicator.innerText = "Player 1's Turn";
    timerBtn.style.backgroundColor = "var(--pink-color)";
    turn = 0;
  } else {
    turnIndicator.innerText = "Player 2's Turn";
    timerBtn.style.backgroundColor = "var(--yellow-color)";
    turn = 1;
  }
  timer = maxTime;
  timeField.innerText = timer + "s";
  changeHoverColor();
}
function CountDown() {
  if (timer == 0) {
    endTurn();
  } else {
    --timer;
    timeField.innerHTML = timer + "s";
  }
}

//Moving eyes code
window.addEventListener("mousemove", function (event) {
  const x = -(window.innerWidth / 2 - event.pageX) / 200;
  const y = -(window.innerHeight / 2 - event.pageY) / 100;
  playerOneEye.style.transform = `translateY(${y}px) translateX(${x}px)`;
  playerTwoEye.style.transform = `translateY(${y}px) translateX(${x}px)`;
});

function GetOffset(element) {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  let rect = element.getBoundingClientRect();
  let win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}

function areFourConnected(player) {
  let height = boardHeight;
  let width = boardWidth-1;
  // horizontalCheck
  for (let j = 0; j < height - 3; j++) {
    for (let i = 0; i < width; i++) {
      if (
        board[i][j] == player &&
        board[i][j + 1] == player &&
        board[i][j + 2] == player &&
        board[i][j + 3] == player
      ) {
        winningCombo=[board[i][j],board[i][j + 1],board[i][j + 2],board[i][j + 3]];
        return winningCombo;
      }
    }
  }
  // verticalCheck
  for (let i = 0; i < width - 3; i++) {
    for (let j = 0; j < height; j++) {
      if (
        board[i][j] == player &&
        board[i + 1][j] == player &&
        board[i + 2][j] == player &&
        board[i + 3][j] == player
      ) {
        winningCombo=[board[i][j],board[i+1][j],board[i+2][j],board[i+3][j]];
        return winningCombo;
      }
    }
  }
  // ascendingDiagonalCheck
  for (let i = 3; i < width; i++) {
    for (let j = 0; j < height - 3; j++) {
      if (
        board[i][j] == player &&
        board[i - 1][j + 1] == player &&
        board[i - 2][j + 2] == player &&
        board[i - 3][j + 3] == player
      ){
        winningCombo=[board[i][j],board[i-1][j],board[i-2][j],board[i-3][j]];
        return winningCombo;}
    }
  }
  // descendingDiagonalCheck
  for (let i = 3; i < width; i++) {
    for (let j = 3; j < height; j++) {
      if (
        board[i][j] == player &&
        board[i - 1][j - 1] == player &&
        board[i - 2][j - 2] == player &&
        board[i - 3][j - 3] == player
      ){
        winningCombo=[board[i][j],board[i-1][j-1],board[i-2][j-2],board[i-3][j-3]];
        return winningCombo;
      }
    }
  }
  return false;
}

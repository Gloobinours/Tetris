import { Queue } from './Queue.js';
import { Block } from './Block.js';

window.gameBoard = [];
window.HEIGHT = 20;
window.WIDTH = 10;
window.init = init;
window.restartGame = restartGame;
const QUEUE_SIZE = 5;
let currentBlock = {};
let queue;
let intervalId;
let canvas = document.getElementById('gameBoard');
let ctx = canvas.getContext('2d');
let score;
let level;
let speed;
let hold;
let gameOver = false;

// list of blocks
let blocks = {
  "T": [[[0,1,0], [1,1,1]], 'purple', 3],
  "L-left": [[[1,0,0], [1,1,1]], 'blue', 3],
  "L-right": [[[0,0,1], [1,1,1]], 'orange', 3],
  "Z-left": [[[1,1,0], [0,1,1]], 'red', 3],
  "Z-right": [[[0,1,1], [1,1,0]], 'green', 3],
  "bar": [[[1,1,1,1]], 'cyan', 3],
  "square": [[[1,1], [1,1]], 'yellow', 4]
}

// create a game board
function createGameBoard() {
  for (let i = 0; i < window.HEIGHT; i++) {
    window.gameBoard[i] = [];
    for (let j = 0; j < window.WIDTH; j++) {
      window.gameBoard[i][j] = null;
    }
  }
}

function drawHold() {
  // Get the canvas element for the queue
  let holdCanvas = document.getElementById("hold");
  let holdCtx = holdCanvas.getContext("2d");

  // Clear the canvas
  holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);

  // draw block
  if (hold) {
    for (let i = 0; i < hold.tiles.length; i++) {
      for (let j = 0; j < hold.tiles[i].length; j++) {
        if (hold.tiles[i][j] === 1) {
          holdCtx.fillStyle = hold.color;
          holdCtx.fillRect(
          j * holdCanvas.width/6 + holdCanvas.width/4, 
          i * holdCanvas.height/4 + holdCanvas.height/4, 
          holdCanvas.width/6, 
          holdCanvas.height/4);
        }
      }
    }
  }
}

function changeHold() {
  // switch hold and currentBlock
  let tempBlock = currentBlock; 
  currentBlock = hold;
  hold = tempBlock;

  // set new currentBlock
  if (currentBlock == null) {
    currentBlock = queue.dequeue();
  }

  drawHold();

  // reset location data
  currentBlock.y = 0;
  currentBlock.x = 3
}

function drawScore() {
  document.getElementById("score").innerHTML=`Score: ${score}`;
  document.getElementById("level").innerHTML=`Level: ${level}`;
}

function drawQueue() {
  // Get the canvas element for the queue
  let queueCanvas = document.getElementById("queueCanvas");
  let queueCtx = queueCanvas.getContext("2d");

  // Clear the canvas
  queueCtx.clearRect(0, 0, queueCanvas.width, queueCanvas.height);

  // Draw each block in the queue
  let yDisplace = queueCanvas.height/20;
  for (let item = 0; item < queue.size(); item++) {
    let block = queue.getItems()[item];
    for (let i = 0; i < block.tiles.length; i++) {
      for (let j = 0; j < block.tiles[i].length; j++) {
        if (block.tiles[i][j] === 1) {
          queueCtx.fillStyle = block.color;
          queueCtx.fillRect(
          j * queueCanvas.width/10 + queueCanvas.width/6, 
          i * queueCanvas.height/20 + yDisplace, 
          queueCanvas.width/10, 
          queueCanvas.height/20);
        }
      }
    }
    yDisplace += queueCanvas.height/QUEUE_SIZE;
  }
}

// create a block
function generateBlock() { // generates a random block
  let blockNames = Object.keys(blocks);
  let randomBlockName = blockNames[Math.floor(Math.random() * blockNames.length)];
  return new Block(blocks[randomBlockName][0], blocks[randomBlockName][1], blocks[randomBlockName][2]);
}

// push a block to the gameBoard
function placeBlock(block) {
  for (let i = 0; i < block.tiles.length; i++) {
    for (let j = 0; j < block.tiles[i].length; j++) {
      if (block.tiles[i][j] === 1) {
        window.gameBoard[block.y + i][block.x + j] = block.color;
      }
    }
  }

  // check for full rows
  clearRows();
  // check for game over
  isGameOver();
}

// restart the game
function restartGame() {
  let text = document.getElementById("textbox").value;
  if (text == "I AM A LOSER") {
    document.getElementById("textbox").value = "";
    init();
  }
}

// check if game is over and end game
function isGameOver() {
  for (let i = 0; i < window.WIDTH; i++) {
    if (window.gameBoard[0][i] !== null) {
      document.getElementById('modal').style.display = 'flex';
      clearInterval(intervalId);
      document.getElementById("gif").src = window.top_10_gifs[Math.round(Math.random()*29)]["media_formats"]["gif"]["url"];
      gameOver = true;
      return true;
    }
  }
  return false;
}

// check if a row is full
function isRowFull(row) {
  for (let i = 0; i < row.length; i++) {
    if (row[i] === null) {
      return false;
    }
  }
  return true;
}

// clear a row and move everything down
function clearRows() {
  let rowsBroken = 0
  for (let row = 0; row < window.HEIGHT; row++) {
    if (isRowFull(window.gameBoard[row])) {
      rowsBroken += 1;
      // move each row down
      for (let rowIndex = row; rowIndex > 0; rowIndex--) {
        window.gameBoard[rowIndex] = window.gameBoard[rowIndex-1];
      }
      window.gameBoard[0] = [];
      // clear top row
      for (let rowIndex = 0; rowIndex < window.WIDTH; rowIndex++) {
        window.gameBoard[0][rowIndex] = null;
      }
      // update score
      score += 100 * rowsBroken;
      drawScore()
      level = Math.ceil(score/1000)
      speed = 1000/level
    }
  }
}

// Draw current block
function drawBlock(block) {
  ctx.translate(0.5, 0.5);
  for (let i = 0; i < block.tiles.length; i++) {
    for (let j = 0; j < block.tiles[i].length; j++) {
      if (block.tiles[i][j] === 1) {
        ctx.fillStyle = block.color;
        ctx.fillRect(
          (block.x + j) * canvas.width/window.WIDTH, 
          (block.y + i) * canvas.height/window.HEIGHT, 
          canvas.width/window.WIDTH, 
          canvas.height/window.HEIGHT);
      }
    }
  }
  ctx.translate(-0.5, -0.5);
}

// Draw board
function drawGameBoard() {
  // gradient
  var grd = ctx.createRadialGradient(canvas.width/2, canvas.width/2, 1000, canvas.width/2, canvas.width/2, 100);
  grd.addColorStop(0, "#FFDEE9");
  grd.addColorStop(1, "#B5FFFC");

  ctx.translate(0.5, 0.5);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < window.HEIGHT; i++) {
    for (let j = 0; j < window.WIDTH; j++) {
      if (window.gameBoard[i][j] !== null) {
        ctx.fillStyle = window.gameBoard[i][j];
        ctx.fillRect(
          j * canvas.width/window.WIDTH, 
          i * canvas.height/window.HEIGHT, 
          canvas.width/window.WIDTH, 
          canvas.height/window.HEIGHT);
      }
    }
  }
  ctx.translate(-0.5, -0.5);
}

// START GAME
function init() {

  gameOver = false;

  // Reset game values
  score = 0;
  level = 1;
  speed = 1000;
  hold = null;
  drawHold();

  window.requestAnimationFrame(gameLoop);

  // Hide modal
  document.getElementById('modal').style.display = 'none';

  // create game board
  createGameBoard();

  // create queue
  queue = new Queue();
  for (let i = 0; i < QUEUE_SIZE; i++) 
    queue.enqueue(generateBlock());

  drawQueue();

  // initialize current block
  currentBlock = generateBlock();

  runInterval();
  drawScore();
}

// start/restart interval loop
function runInterval(placeable=false) {
  clearInterval(intervalId);
  if (placeable) {
    placeBlock(currentBlock);
    currentBlock = queue.dequeue();
    queue.enqueue(generateBlock());
    drawQueue();
    placeable = false;
  }
  intervalId = setInterval(() => {
    // auto drop (gravity)
    currentBlock.moveDown();
    if (currentBlock.isAtBottom()) {
      if (placeable) {
        placeBlock(currentBlock);
        currentBlock = queue.dequeue();
        queue.enqueue(generateBlock());
        drawQueue();
        placeable = false;
      } else placeable = true;
    }
  }, speed);
}

// Key stroke listenener
document.addEventListener('keydown', function(event) {
  switch (event.code) {
    case 'ArrowDown': // move block down
      currentBlock.moveDown();
      break;
    case 'ArrowLeft': // move block left
      currentBlock.moveLeft();
      break;
    case 'ArrowRight': // move block right
      currentBlock.moveRight();
      break;
    case 'ArrowUp': // rotate block right
      currentBlock.rotate();
      break;
    case 'Space': // snap block down
    if (gameOver == true) return;
      currentBlock.snapDown();
      runInterval(true);
      break;
    case 'KeyC': // hold block
      changeHold();
      break;
  }
});

init();

// Game Loop
function gameLoop() {
  if (gameOver == true) return;
  drawGameBoard();
  drawBlock(currentBlock);
  window.requestAnimationFrame(gameLoop);
}
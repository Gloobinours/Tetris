import { Queue } from './Queue.js';
import { Block } from './Block.js';

window.gameBoard = [];
window.HEIGHT = 20;
window.WIDTH = 10;
window.init = init;
const QUEUE_SIZE = 5;
let currentBlock = {};
let queue;
let intervalId;
let canvas = document.getElementById('gameBoard');
let ctx = canvas.getContext('2d');
let level = 1;
let speed = 1000/level;
let score = 0;
let hold;

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
}

function drawScore() {
  document.getElementById("score").innerHTML=`Score: ${score}`;
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

// check if game is over and end game
function isGameOver() {
  for (let i = 0; i < window.WIDTH; i++) {
    if (window.gameBoard[0][i] !== null) {
      document.getElementById('modal').style.display = 'flex';
      clearInterval(intervalId);
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
  for (let row = 0; row < window.HEIGHT; row++) {
    if (isRowFull(window.gameBoard[row])) {
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
      score += 100 * level;
      drawScore()
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
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 15;
        ctx.strokeRect(
          (block.x + j) * canvas.width/window.WIDTH, 
          (block.y + i) * canvas.height/window.HEIGHT, 
          canvas.width/window.WIDTH, 
          canvas.height/window.HEIGHT
        );
      }
    }
  }
  ctx.translate(-0.5, -0.5);
}

// Draw board
function drawGameBoard() {
  ctx.translate(0.5, 0.5);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
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
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 15;
        ctx.strokeRect(
          j * canvas.width/window.WIDTH, 
          i * canvas.height/window.HEIGHT, 
          canvas.width/window.WIDTH, 
          canvas.height/window.HEIGHT
        );
      }
    }
  }
  ctx.translate(-0.5, -0.5);
}

// START GAME
function init() {

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
        currentBlock.snapDown();
        runInterval(true);
        break;
      case 'KeyC': // hold block
        changeHold();
        break;
    }
  });

  drawScore()
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

init();

// Game Loop
function gameLoop() {
  drawGameBoard();
  drawBlock(currentBlock);
  window.requestAnimationFrame(gameLoop);
}
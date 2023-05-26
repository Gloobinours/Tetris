import { Queue } from './Queue.js';
import { Block } from './Block.js';

window.gameBoard = [];
window.HEIGHT = 20;
window.WIDTH = 10;
const QUEUE_SIZE = 5;
let currentBlock = {};
let queue;
let canvas = document.getElementById('gameBoard');
let ctx = canvas.getContext('2d');
let level = 1;
let speed = 500/level;
let score = 0;

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

// create a block
function createRandomBlock() { // creates random block
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
function clearRow(row) {
  for (let i = row; i > 0; i--) {
    window.gameBoard[i] = window.gameBoard[i-1];
  }
  window.gameBoard[0] = [];
  for (let i = 0; i < window.WIDTH; i++) {
    window.gameBoard[0][i] = null;
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
        ctx.lineWidth = 3;
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
        ctx.lineWidth = 3;
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

function init() {
  // create game board
  createGameBoard();

  // create queue
  queue = new Queue();
  for (let i = 0; i < QUEUE_SIZE; i++) {
    queue.enqueue(createRandomBlock());
  }

  // initialize current block
  currentBlock = createRandomBlock();
}

init();

// begin auto drop (gravity)
setInterval(() => {
  // begin auto drop (gravity)
  currentBlock.moveDown();
  if (currentBlock.isAtBottom()) {
    setTimeout(() => {
      if (currentBlock.isAtBottom()) {
        placeBlock(currentBlock);
        currentBlock = queue.dequeue();
        queue.enqueue(createRandomBlock())
        
        // check for full rows
        for (let i = 0; i < window.HEIGHT; i++) {
          if (isRowFull(window.gameBoard[i])) {
            clearRow(i);
          }
        }
      }
    }, speed);
  }
}, speed);

// Key stroke listenener
document.addEventListener('keydown', function(event) {
  switch (event.code) {
    case 'ArrowDown':
      // Handle up arrow key press
      currentBlock.moveDown();
      break;
    case 'ArrowLeft':
      // Handle left arrow key press
      currentBlock.moveLeft();
      break;
    case 'ArrowRight':
      // Handle right arrow key press
      currentBlock.moveRight();
      break;
    case 'ArrowUp': // rotate right
      // Handle right arrow key press
      currentBlock.rotate();
      break;
    case 'Space':
      // Handle right arrow key press
      currentBlock.snapDown();
      break; 
  }
});

// Game Loop
function gameLoop() {
  drawGameBoard();
  drawBlock(currentBlock);
  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
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

let blocks = {
  "T": new Block([[0,1,0], [1,1,1]], 'purple', 3),
  "L-left": new Block([[1,0,0], [1,1,1]], 'blue', 3),
  "L-right": new Block([[0,0,1], [1,1,1]], 'orange', 3),
  "Z-left": new Block([[1,1,0], [0,1,1]], 'red', 3),
  "Z-right": new Block([[0,1,1], [1,1,0]], 'green', 3),
  "bar": new Block([[1,1,1,1], []], 'cyan', 3),
  "square": new Block([[1,1], [1,1]], 'yellow', 4)
}

function createGameBoard() {
  for (let i = 0; i < window.HEIGHT; i++) {
    window.gameBoard[i] = [];
    for (let j = 0; j < window.WIDTH; j++) {
      window.gameBoard[i][j] = null;
    }
  }
}

function createRandomBlock() { // creates random block
  let blockNames = Object.keys(blocks);
  let randomBlockName = blockNames[Math.floor(Math.random() * blockNames.length)];
  return blocks[randomBlockName];
}

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

function drawGameBoard() {
  ctx.translate(0.5, 0.5);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black'; // wtf?
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
  createGameBoard();

  // create queue
  queue = new Queue();
  for (let i = 0; i < QUEUE_SIZE; i++) {
    queue.enqueue(createRandomBlock());
  }

  // initialize current block
  currentBlock = createRandomBlock();

  // begin auto drop
  let autoDrop = setInterval(() => {
    currentBlock.moveDown();
  }, speed);
  
}

init();

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

function gameLoop() {
  drawGameBoard();
  drawBlock(currentBlock);
  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
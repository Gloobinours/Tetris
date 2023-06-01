/**
 * Represent a block in the game.
 * A block can be used in the gameboard as well as in the queue and the hold slot.
 */
export class Block {
  /**
   * Constructs a new Block object with the given parameters.
   *
   * @param type the type of block
   * @param tiles the tiles that make up the block
   * @param r the red component of the block's color
   * @param g the green component of the block's color
   * @param b the blue component of the block's color
   * @param x the x-coordinate of the block's position
   */
  constructor(type, tiles, r, g, b, x) {
    this.type = type;
    this.tiles = tiles;
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = 0;
  }

  /**
   * Check if the block is colliding with other blocks
   * @param {array} tempTiles Block tiles
   * @returns {boolean}
   */
  #isColliding(tempTiles) {
    // check if block is colliding with another block
    for (let i = 0; i < tempTiles.length; i++) {
      for (let j = 0; j < tempTiles[i].length; j++) {
        if (tempTiles[i][j] === 1 && gameBoard[this.y + i][this.x + j] !== null) return true;
      }
    }
  }

  /**
   * Handle collisions for rating
   * @param {*} tempTiles Block tiles
   * @returns 
   */
  #rotateCollision(tempTiles) {
    // while rotated block is colliding with another block, move it up
    for (let z = 1; true; z++) {
      if (z >= 3) {
        this.y += 2;
        return false;
      }
      else if (this.#isColliding(tempTiles)) {
        this.y--;
      } else return true;
    }
  }

  /**
   * Rotate the block clockwise
   */
  rotate() {
    const rotatedTiles = [];
    for (let i = 0; i < this.tiles[0].length; i++) {
      const newRow = [];
      for (let j = this.tiles.length - 1; j >= 0; j--) {
        newRow.push(this.tiles[j][i]);
      }
      rotatedTiles.push(newRow);
    }

    // keep block in bounds
    if (this.x + rotatedTiles[0].length >= window.WIDTH) {
      this.x = window.WIDTH - rotatedTiles[0].length;
    }
    if (this.y + rotatedTiles.length >= window.HEIGHT) {
      this.y = window.HEIGHT - rotatedTiles.length;
    }

    // handle collisions
    if (!this.#rotateCollision(rotatedTiles)) return;

    // set rotated tiles to current block
    this.tiles = rotatedTiles;
  }

  /**
   * Move block left by one tile
   */
  moveLeft() {
    if (this.x <= 0) return; // block out of bounds
    // check if block would collide with another block
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j] === 1) {
          if (gameBoard[this.y + i][this.x + j - 1] !== null) return;
        }
      }
    }

    this.x--;
  }
  /**
   * Move block right by one tile
   */
  moveRight() {
    if (this.x + this.tiles[0].length >= window.WIDTH) return; // block out of bounds
    // check if block would collide with another block
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j] === 1) {
          if (gameBoard[this.y + i][this.x + j + 1] !== null) return;
        }
      }
    }
    this.x++;
  }
  /**
   * Manually moves the block down by one tiles + gravity
   */
  moveDown() {
    if (this.isAtBottom()) return; // block out of bounds
    this.y++;
  }
  /**
   * Snap the block at the bottom of the gameboard
   */
  snapDown() {
    while (!this.isAtBottom()) {
      this.moveDown();
    }
  }

  /**
   * Check if the block can't go further down
   * @returns {boolean}
   */
  isAtBottom() {
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j] === 1) {
          if (this.y + i === window.HEIGHT - 1) return true;
          if (gameBoard[this.y + i + 1][this.x + j] !== null) return true;
        }
      }
    }
    return false;
  }

  /**
   * Returns the color of the block in RGBA format.
   * 
   * @param alpha The alpha value of the color (default is 1).
   * @return The color of the block in RGBA format.
   */
  getColor(alpha=1) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
  }

  /**
   * Resets the block to its initial state.
   */
  reset() {
    this.tiles = window.blocks[this.type].tiles;
    this.x = window.blocks[this.type].x;
  }

}
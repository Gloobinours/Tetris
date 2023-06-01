export class Block {
  constructor(tiles, r, g, b, x) {
    this.tiles = tiles;
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = 0;
  }

  #isColliding(tempTiles) {
    // check if block is colliding with another block
    for (let i = 0; i < tempTiles.length; i++) {
      for (let j = 0; j < tempTiles[i].length; j++) {
        if (tempTiles[i][j] === 1 && gameBoard[this.y + i][this.x + j] !== null) return true;
      }
    }
  }

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
  moveDown() {
    if (this.isAtBottom()) return; // block out of bounds
    this.y++;
  }
  snapDown() {
    while (!this.isAtBottom()) {
      this.moveDown();
    }
  }

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

  getColor(alpha=1) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
  }

}
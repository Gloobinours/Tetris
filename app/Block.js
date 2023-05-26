export class Block {
  constructor(tiles, color, x) {
    this.tiles = tiles;
    this.color = color;
    this.x = x;
    this.y = 0;
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
    this.tiles = rotatedTiles;

    // if rotated block is out of bounds, move it back in bounds
    if (this.x + this.tiles[0].length >= window.WIDTH)
      this.x = window.WIDTH - this.tiles[0].length;
    
    if (this.y + this.tiles.length >= window.HEIGHT)
      this.y = window.HEIGHT - this.tiles.length;
  }

  moveLeft() {
    if (this.x <= 0) return;
    this.x--;
  }
  moveRight() {
    if (this.x + this.tiles[0].length >= window.WIDTH) return;
    this.x++;
  }
  moveDown() {
    if (this.isAtBottom()) return;
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

}
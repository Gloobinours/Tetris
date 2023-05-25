export class Block {
  constructor(tiles, color, x) {
    this.tiles = tiles;
    this.color = color;
    this.x = x;
    this.y = 0;
  }

  rotate() {
    let temp = new Array(this.tiles.length).fill(defaultValue);
    for (let j = 0; j < this.tiles.length; j++) {
      for (let i = 0; this.tiles[i].length >= 0; i--) {
        temp[i][j].push(this.tiles[j][i]);
      }
    }
  }

  moveLeft() {
    this.x--;
  }
  moveRight() {
    this.x++;
  }
  moveDown() {
    this.y++;
  }
  snapDown() {
    // TODO!
  }
}
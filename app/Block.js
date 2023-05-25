export class Block {
  constructor(tiles, color, x) {
    this.tiles = [];
    this.color = '';
    this.x = 3;
    this.y = 0;
  }

  rotate() {
    let rotated = [];
    for (let i = 0; i < this.tiles.length; i++) {
      let row = [];
      for (let j = 0; j < this.tiles[i].length; j++) {
        row.push(this.tiles[j][i]);
      }
      rotated.push(row.reverse());
    }
    this.tiles = rotated;
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
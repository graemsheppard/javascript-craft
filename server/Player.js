const Gun = require('./Gun');
const ROOT_TWO = Math.sqrt(2);
class Player {

  constructor (socket, ms) {
    this.socket = socket;
    this.speed = 5;
    this.r = 20;
    this.x = Math.random() * 700 + 50;
    this.y = Math.random() * 500 + 50;
    this.hp = 100;
    this.kills = 0;
    this.gun = new Gun(40, 5);
    this.m = {
      up: false,
      down: false,
      left: false,
      right: false
    }
    this.mapSize = ms;
  }

  move() {
    if (this.m.up) { this.y -= this.speed; }
    if (this.m.down) { this.y += this.speed; }
    if (this.m.left) { this.x -= this.speed; }
    if (this.m.right) { this.x+= this.speed; }
    if (this.x > this.mapSize.w) { this.x = 0; }
    if (this.x < 0) { this.x = this.mapSize.w; }
    if (this.y > this.mapSize.h) { this.y = 0; }
    if (this.y < 0) { this.y = this.mapSize.h; }
  }

  collision (barrier) {
    let temp = false;
    if (this.m.left) {
      this.x += this.speed;
      temp = true;
    }
    if (this.m.down) {
      this.y -= this.speed;
      temp = true;
    }
    if (this.m.right) {
      this.x -= this.speed;
      temp = true;
    }
    if (this.m.up) {
      this.y += this.speed;
      temp = true;
    }
    if (!temp) {
      this.y = barrier.y - this.r;
    }

  }



}

module.exports = Player;

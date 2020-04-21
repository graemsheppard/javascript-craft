class Bullet {
  constructor (s, d, id, ms) {
    this.pos = s;
    this.dir = d;
    this.r = 3;
    this.v = 30;
    this.id = id;
    this.count = 0;
    this.mapSize = ms;
  }


  move () {
    this.pos = this.pos.add(this.dir.multiply(this.v));
    this.count += 1000 / 60;
    if (this.pos.x > this.mapSize.w) { this.pos.x = 0; }
    if (this.pos.x < 0) { this.pos.x = this.mapSize.w; }
    if (this.pos.y > this.mapSize.h) { this.pos.y = 0; }
    if (this.pos.y < 0) { this.pos.y = this.mapSize.h; }
  }
}


module.exports = Bullet;

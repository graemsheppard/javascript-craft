class Bullet {
  constructor (s, d, id) {
    this.pos = s;
    this.dir = d;
    this.r = 3;
    this.v = 30;
    this.id = id;
    this.count = 0;
  }


  move () {
    this.pos = this.pos.add(this.dir.multiply(this.v));
    this.count += 1000 / 60;
    if (this.pos.x > 1600) { this.pos.x = 0; }
    if (this.pos.x < 0) { this.pos.x = 1600; }
    if (this.pos.y > 1200) { this.pos.y = 0; }
    if (this.pos.y < 0) { this.pos.y = 1200; }
  }
}


module.exports = Bullet;

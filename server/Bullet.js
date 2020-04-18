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
  }
}


module.exports = Bullet;

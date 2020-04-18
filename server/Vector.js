class Vector {

  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  magnitude () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  norm () {
    let m = this.magnitude();
    return (new Vector (this.x / m, this.y / m));
  }

  add (v) {
    let x = this.x + v.x;
    let y = this.y + v.y;
    return (new Vector(x, y));
  }

  subtract (v) {
    let x = this.x - v.x;
    let y = this.y - v.y;
    return (new Vector(x, y));
  }

  multiply (k) {
    let x = this.x * k;
    let y = this.y * k;
    return (new Vector(x, y));
  }

}

module.exports = Vector;

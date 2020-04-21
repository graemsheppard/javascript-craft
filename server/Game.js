const Vector = require('./Vector');
const Bullet = require('./Bullet');
const Barrier = require('./Barrier');
const Player = require('./Player');

class Game {

  constructor (io) {
    this.io = io;
    this.players = [];
    this.bullets = [];
    this.barriers = [];

    this.__start();

  }

  __start() {
    this.__createBarriers();
    this.__update();
  }

  __update() {
    setInterval(() => {
      this.__movePlayers();
      this.__moveBullets();
      this.__checkCollisions();
      this.__checkPlayersHit();
      this.__sendPositions();
      this.__sendHP();
    }, 1000 / 60);
  }



  addPlayer (player) {
    this.__sendBarriers(player.socket.id);
    this.players.push(player);
    player.socket.on('move', (move) => {
      player.m = move;
    });
    player.socket.on('fire', (mousePos) => {
      let midPos = new Vector(400, 300);
      let mPos = new Vector(mousePos.x, mousePos.y);
      let pPos = new Vector(player.x, player.y);
      let dir = mPos.subtract(midPos);
      dir = dir.norm();
      let spread = 0.15;
      dir = dir.add(new Vector(spread * (Math.random() - 0.5), spread * (Math.random() - 0.5)));
      let b = new Bullet (pPos.add(dir.multiply(player.gun.l)), dir, player.socket.id);
      this.bullets.push(b);
    });
    player.socket.on('mousepos', (mousePos) => {
      let midPos = new Vector(400, 300);
      let mPos = new Vector(mousePos.x, mousePos.y);
      let dir = mPos.subtract(midPos);
      let theta = Math.acos(dir.x / dir.magnitude());
      if (mPos.y < midPos.y) { theta *= -1; }
      player.gun.theta = theta;
    });

  }

  __createBarriers () {
    let rand = Math.floor(Math.random() * 10 + 5);
    for (let i = 0; i < rand; i++) {
      let rx = Math.floor(Math.random() * 1600);
      let ry = Math.floor(Math.random() * 1200);
      let rw = Math.floor(Math.random() * 100 + 50);
      let rh = Math.floor(Math.random() * 100 + 50);
      this.barriers[i] = new Barrier(rx, ry, rw, rh);
    }
  }

  __sendBarriers (id) {
    let barriers = [];
    for (let i = 0; i < this.barriers.length; i++) {
      let b = {
        x: this.barriers[i].x,
        y: this.barriers[i].y,
        w: this.barriers[i].w,
        h: this.barriers[i].h
      }
      barriers[i] = b;
    }
    this.io.to(id).emit('barriers', barriers);
  }

  __movePlayers () {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].move();
    }
  }

  __moveBullets () {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].move();
      if (this.bullets[0].count > 300) {
        this.bullets.splice(0, 1);
      }
    }
  }

  __sendPositions () {
    let coords = [];

    for (let i = 0; i < this.players.length; i++) {
      let temp = {
        x: this.players[i].x,
        y: this.players[i].y,
        r: this.players[i].r,
        gun: this.players[i].gun,
        id: this.players[i].socket.id
      }
      coords.push(temp);
    }

    for (let i = 0; i < this.bullets.length; i++) {
      let temp = {
        x: this.bullets[i].pos.x,
        y: this.bullets[i].pos.y,
        r: this.bullets[i].r
      }
      coords.push(temp);
    }
    this.io.sockets.emit('positions', coords);
  }

  __sendHP () {
    for (let i = 0; i < this.players.length; i++) {
      let p = this.players[i];
      this.io.to(p.socket.id).emit('hp', p.hp);
      this.io.to(p.socket.id).emit('kills', p.kills);
    }
  }

  __checkPlayersHit() {
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < this.bullets.length; j++) {
        let p = this.players[i];
        let b = this.bullets[j];
        if (b.id == p.socket.id) { continue; }
        if ((b.pos.x > p.x - p.r && b.pos.x < p.x + p.r) &&
            (b.pos.y > p.y - p.r && b.pos.y < p.y + p.r)) {
          this.bullets.splice(j, 1);
          p.hp -= 15;
          if (p.hp <= 0) {
            for (let k = 0; k < this.players.length; k++) {
              if (b.id == this.players[k].socket.id) {
                this.players[k].kills++;
              }
            }
            let temp1 = p.socket;
            let temp2 = p.kills;
            this.removePlayer(p.socket.id);
            p = new Player(temp1);
            p.kills = temp2;
            this.addPlayer(p);
          }
        }
      }
    }
  }

  __checkCollisions () {
    for (let i = 0; i < this.barriers.length; i++) {
      let bar = this.barriers[i];
      for (let j = 0; j < this.bullets.length; j++) {
        let bul = this.bullets[j].pos;
        if (bul.x > bar.x && bul.x < bar.x + bar.w) {
          if (bul.y > bar.y && bul.y < bar.y + bar.h) {
            this.bullets.splice(j, 1);
          }
        }
      }

      for (let j = 0; j < this.players.length; j++) {
        let p = this.players[j];
        if (p.x > bar.x - p.r && p.x < bar.x + bar.w + p.r) {
          if (p.y > bar.y - p.r && p.y < bar.y + bar.h + p.r) {
            p.collision(bar);
          }
        }
      }
    }
  }

  removePlayer(id) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].socket.id == id) {
        this.players[i].socket.removeAllListeners();
        this.players.splice(i, 1);
      }
    }
  }


}


module.exports = Game;

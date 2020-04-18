window.onload = function () {
  cvs = document.getElementById('canvas');
  ctx = cvs.getContext('2d');


  var socket = io();
  var coords;
  var kills = 0;
  let mousePos = {
    x: 0,
    y: 0
  }
  var hp;
  let move = {
    up: false,
    down: false,
    left: false,
    right: false
  }
  let barriers = [];

  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyD':
        move.right = true;
        break;
      case 'KeyA':
        move.left = true;
        break;
      case 'KeyW':
        move.up = true;
        break;
      case 'KeyS':
        move.down = true;
        break;
    }
  });

  window.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyD':
        move.right = false;
        break;
      case 'KeyA':
        move.left = false;
        break;
      case 'KeyW':
        move.up = false;
        break;
      case 'KeyS':
        move.down = false;
        break;
    }
  });

  cvs.addEventListener('mousedown', (e) => {
    socket.emit('fire', mousePos);
  });

  cvs.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX + window.scrollX;
    mousePos.y = e.clientY + window.scrollY;
  });

  setInterval(() => {
    socket.emit('move', move);
    socket.emit('mousepos', mousePos);
    if (coords && hp) {
      draw(coords, hp);
    }


  }, 1000 / 60);

  socket.on('positions', (c) => {
    coords = c;
  });

  socket.on('hp', (h) => {
    hp = h;
  });

  socket.on('kills', (k) => {
    kills = k;
  });

  socket.on('barriers', (b) => {
    barriers = b;
    console.log(barriers);
  });

  function draw () {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawObjects();
    drawHP();
    drawText();

  }

  function drawBarriers () {

  }

  function drawObjects () {
    let p;
    for (let i = 0; i < coords.length; i++) {
      if (coords[i].id == socket.id) {
        p = coords[i];
      }
    }

    cvs.width += 0;
    ctx.translate(cvs.width / 2 - p.x, cvs.height / 2 - p.y);

    for (let i = 0; i < coords.length; i++) {
      if (coords[i].id == socket.id) {
        ctx.fillStyle = 'blue';
      } else {
        ctx.fillStyle = 'black';
      }
      ctx.beginPath();
      ctx.arc(coords[i].x, coords[i].y, coords[i].r, 0, 2 * Math.PI);
      ctx.fill();

      if (coords[i].gun) {
        ctx.translate(coords[i].x, coords[i].y);
        ctx.rotate(coords[i].gun.theta);
        ctx.beginPath();
        ctx.rect(0, -coords[i].gun.w / 2, coords[i].gun.l, coords[i].gun.w);
        ctx.fill();
        ctx.rotate(-coords[i].gun.theta);
        ctx.translate(-coords[i].x, -coords[i].y);
      }

    }
  }

  function drawText () {
    ctx.resetTransform();
    ctx.fillStyle = 'black';
    ctx.fillText('Kills:', 50, 30)
    ctx.fillText(('' + kills), 50, 70);
  }


  function drawHP () {
    ctx.resetTransform();
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.rect((cvs.width - 4 * hp) / 2, 5, 4 * hp, 10);
    ctx.fill();
  }

}

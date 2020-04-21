// Dependancies

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Game = require('./Game');
const Player = require('./Player');
const app = express();

// Assign the working directory
const clientPath = `${__dirname}/../client`;
console.log(`Serving from ${clientPath}`);
app.use(express.static(clientPath));

// Create the server
const server = http.createServer(app);
const io = socketio(server);

// Start the server
server.on('error', (err) =>{
  console.error('Server error:' + err);
});

server.listen(3000, 'localhost');
console.log("Game started on 3000");

var players = [];
var game = null;

io.sockets.on('connection', (socket) => {
  if (!game) {
    game = new Game (io);
  }
  game.addPlayer(socket);

  socket.on('disconnect', () => {
    game.removePlayer(socket.id);
  });

});

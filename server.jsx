const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let gameState = {
  boxes: Array(3).fill(Array(3).fill("")),
  currentPlayer: null,
};

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.emit('gameState', gameState);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('makeMove', (data) => {
    gameState.boxes[data.row][data.col] = data.symbol;
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    io.emit('gameState', gameState);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});

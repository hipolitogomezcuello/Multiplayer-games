const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const lobbySocket = require("./sockets/lobby");
const tictactoeSocket = require("./sockets/tictactoe");
const port = process.env.PORT || 8080;

const main = async () => {
  const app = express();
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: []
    }
  });
  server.listen(port);
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
  });
  app.get("/lobbies/:lobbyId", (req, res) => {
    res.sendFile(__dirname + "/pages/insideLobby.html");
  });
  app.get("/lobbies", (req, res) => {
    res.sendFile(__dirname + "/pages/lobbies.html");
  });
  app.get("/games/:gameTitle/:gameId", (req, res) => {
    res.sendFile(__dirname + "/pages/games/tictactoe.html");
  });
  app.use(express.static("public"));
  io.of("/lobbies").on("connection", (socket) => lobbySocket(socket));
  io.of("/games/tictactoe").on("connection", (socket) => tictactoeSocket(socket));
  console.log(`Listening on http://localhost:${port}`);
}

module.exports = main;
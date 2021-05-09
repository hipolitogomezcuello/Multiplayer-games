const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const lobbySocket = require("./sockets/lobby");
const port = 8080;

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
    res.sendFile(__dirname + "/pages/lobbies.html")
  });
  app.use(express.static("public"));
  io.of("/lobbies").on("connection", (socket) => lobbySocket(socket, io));
}

module.exports = main;
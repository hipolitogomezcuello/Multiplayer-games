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
  app.use(express.static("public"));
  io.on("connection", (socket) => {
    console.log("Someone connected!");
    socket.emit("welcome", "Wolcome!!!!");
  });
}

module.exports = main;
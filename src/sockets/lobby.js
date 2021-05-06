const lobbyService = require("../services/lobby");
const playerService = require("../services/player");

module.exports = (socket) => {
  socket.on("connection", () => {
    socket.join("lobbies");
  });

  socket.on("find all", () => {
    socket.emit("find all", lobbyService.findAll());
  });

  socket.on("join lobby", data => {
    lobbyService.joinPlayer(data.player, data.lobbyId);
    socket.leave("lobbies");
    socket.to(data.lobbyId).emit("player joined", data.player);
    socket.emit("join lobby", lobby.findById(data.lobbyId));
    socket.join(data.lobbyId);
  });

  socket.on("create player", (username) => {
    socket.emit("create player", playerService.create(username))
  });

  socket.on("create lobby", (data) => {
    const lobby = service.create(data.name, data.host);
    socket.to("lobbies").emit("new lobby", lobby);
    socket.leave("lobbies");
    socket.join(lobby.id);
    socket.emit("create lobby", lobby);
  });

  socket.on("find players of lobby", lobbyId => {
    socket.emit("find players of lobby", lobbyService.findById(lobbyId).players);
  });

  socket.on("leave lobby", data => {
    lobbyService.removePlayer(data.lobbyId, data.playerId);
    socket.leave(data.lobbyId);
    socket.join("lobbies");
  });

  socket.on("delete lobby", lobbyId => {
    socket.broadcast.emit("lobby deleted", lobbyId);
    socket.to(lobbyId).emit("lobby deleted");
    socket.clients(lobbyId).forEach(client => {
      client.leave(lobbyId);
      client.join("lobbies");
    });
    lobbyService.delete(lobbyId);
  });
}
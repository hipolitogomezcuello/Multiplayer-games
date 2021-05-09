const lobbyService = require("../services/lobby");
const playerService = require("../services/player");

module.exports = (socket, io) => {
  socket.on("find all", () => {
    socket.join("lobbies");
    socket.emit("find all", { lobbies: lobbyService.findAll() });
  });

  socket.on("join lobby", data => {
    socket.leave("lobbies");
    lobbyService.joinPlayer(data.player, data.lobbyId);
    socket.to(data.lobbyId).emit("player joined", { player: data.player });
    socket.emit("join lobby", { lobby: lobbyService.findById(data.lobbyId) });
  });

  socket.on("create player", (data) => {
    console.log(`Created Player: ${data.username}`);
    socket.emit("create player", { player: playerService.create(data.username) });
  });

  socket.on("create lobby", (data) => {
    const lobby = lobbyService.create(data.name, data.host);
    const rooms = socket.rooms;
    socket.to("lobbies").emit("new lobby", { lobby });
    console.log(`Created Lobby: ${lobby.name}`);
    socket.leave("lobbies");
    socket.join(lobby.id);
    socket.emit("create lobby", { lobby });
  });

  socket.on("find players of lobby", (data) => {
    socket.join(data.lobbyId);
    const lobby = lobbyService.findById(data.lobbyId);
    socket.emit("find players of lobby", { players: lobby.players });
  });

  socket.on("leave lobby", ({ lobbyId, playerId }) => {
    lobbyService.removePlayer(lobbyId, playerId);
    socket.to(lobbyId).emit("player left lobby", { playerId });
    socket.leave(lobbyId);
  });

  socket.on("delete lobby", ({ lobbyId }) => {
    lobbyService.delete(lobbyId);
    socket.to("lobbies").emit("lobby deleted", { lobbyId });
    socket.to(lobbyId).emit("lobby deleted", { lobbyId });
    socket.emit("lobby deleted", { lobbyId });
  });

  socket.on("start game", ({ lobbyId }) => {
    const lobby = lobbyService.findById(lobbyId);
    socket.to("lobbies").emit("lobby deleted", { lobbyId });
    lobbyService.delete(lobbyId);
    
  });
}
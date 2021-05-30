const lobbyService = require("../services/lobby");
const playerService = require("../services/player");
const gameService = require("../services/game");

module.exports = (socket) => {
  socket.on("find all", () => {
    socket.join("lobbies");
    socket.emit("find all", { lobbies: lobbyService.findAll() });
  });

  socket.on("join lobby", ({player, lobbyId}) => {
    socket.leave("lobbies");
    lobbyService.joinPlayer(player, lobbyId);
    socket.to("lobbies").emit("player joined lobby", { player, lobbyId });
    socket.to(lobbyId).emit("player joined", { player });
    socket.emit("join lobby", { lobby: lobbyService.findById(lobbyId) });
  });

  socket.on("create player", (data) => {
    console.log(`Created Player: ${data.username}`);
    socket.emit("create player", { player: playerService.create(data.username) });
  });

  socket.on("create lobby", (data) => {
    const lobby = lobbyService.create(data.name, data.host);
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

  socket.on("start game", ({ lobbyId, selectedGame }) => {
    const lobby = lobbyService.findById(lobbyId);
    const game = gameService.create(lobby, selectedGame);
    socket.to(lobbyId).emit("start game", { game });
    socket.emit("start game", { game });
  });
}
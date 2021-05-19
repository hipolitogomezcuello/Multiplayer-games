const Lobby = require("../domain/Lobby");

const lobbies = {}

module.exports = {
  findAll: () => {
    return Object.values(lobbies);
  },
  joinPlayer: (player, lobbyId) => {
    lobbies[lobbyId].addPlayer(player);
  },
  findById: (id) => {
    return lobbies[id];
  },
  create: (name, host) => {
    const lobby = new Lobby(name, host);
    lobbies[lobby.id] = lobby;
    return lobby;
  },
  removePlayer: (lobbyId, playerId) => {
    const lobby = lobbies[lobbyId];
    if (lobby.hostId === playerId) {
      throw new Error("Cannot remove host from lobby, try deleting the lobby instead.");
    }
    lobby.removePlayer(playerId);
  },
  delete: (id) => {
    delete lobbies[id];
  },
}
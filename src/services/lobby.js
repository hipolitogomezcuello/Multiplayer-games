const { v4: uuidv4 } = require('uuid');

const lobbies = {}

module.exports = {
  findAll: () => {
    return Object.values(lobbies);
  },
  joinPlayer: (player, lobbyId) => {
    lobbies[lobbyId].players[player.id] = player;
  },
  findById: (id) => {
    return lobbies[id];
  },
  create: (name, host) => {
    const players = {}
    players[host.id] = host;
    const id = uuidv4();
    lobbies[id] = {
      name,
      id,
      hostId: host.id,
      players,
    }
    return lobbies[id];
  },
  removePlayer: (lobbyId, playerId) => {
    const lobby = lobbies[lobbyId];
    if (lobby.hostId === playerId) {
      throw new Error("Cannot remove host from lobby, try deleting the lobby instead.");
    }
    delete lobby.players[playerId];
  },
  delete: (id) => {
    delete lobbies[id];
  },
}
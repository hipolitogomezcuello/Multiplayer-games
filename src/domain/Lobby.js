const { v4: uuidv4 } = require("uuid");

module.exports = class Lobby {
  constructor(name, host) {
    const players = {};
    players[host.id] = host;
    (this.name = name), (this.hostId = host.id);
    this.id = uuidv4();
    this.players = players;
    this.game = undefined;
    this.gameInProgress = false;
  }

  removePlayer = (id) => {
    delete this.players[id];
    if (this.game) {
      this.game.removePlayer(player);
    }
  };

  addPlayer = (player) => {
    this.players[player.id] = player;
    if (this.game) {
      this.game.joinPlayer(player);
    }
  };
};

const AdventureDice = require("../domain/games/adventuredice/AdventureDice");
const Tictactoe = require("../domain/games/tictactoe/Tictactoe");
const games = {};

module.exports = {
  create: (lobby, gameTitle) => {
    let game;
    switch (gameTitle) {
      case "tictactoe":
        game = new Tictactoe(lobby);
        break;
      case "adventuredice":
        game = new AdventureDice(lobby.id, lobby.players);
        break;
      default:
        throw new Error("Unsupported game");
    }
    games[game.id] = game;
    return game;
  },
  findById: (id) => games[id],
  deleteById: (id) => delete games[id],
};

const Tictactoe = require("../domain/games/Tictactoe")
const games = {}

module.exports = {
  create: (lobby, gameTitle) => {
    let game;
    switch (gameTitle) {
      case "tictactoe":
        game = new Tictactoe(lobby);
        break;
      default:
        throw new Error("Unsupported game");
    }
    games[game.id] = game;
    return game;
  },
  findById: (id) => games[id],
}
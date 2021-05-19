module.exports = class Tictactoe {
  constructor(lobby) {
    this.id = lobby.id;
    this.name = "tictactoe";
    this.players = lobby.players;
  }
}
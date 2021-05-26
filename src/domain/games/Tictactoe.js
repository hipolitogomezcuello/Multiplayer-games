const newMap = () => ({
  a1: undefined,
  b1: undefined,
  c1: undefined,
  a2: undefined,
  b2: undefined,
  c2: undefined,
  a3: undefined,
  b3: undefined,
  c3: undefined,
});
const winningCombos = [
  ["a1", "b1", "c1"],
  ["a2", "b2", "c2"],
  ["a3", "b3", "c3"],
  ["a1", "a2", "a3"],
  ["b1", "b2", "b3"],
  ["c1", "c2", "c3"],
  ["a1", "b2", "c3"],
  ["c1", "b2", "a3"],
]

module.exports = class Tictactoe {
  constructor(lobby) {
    this.id = lobby.id;
    this.name = "tictactoe";
    this.players = lobby.players;
    this.currentTurnPlayerId = null;
    this.map = newMap();
    this.result = undefined;
    this.winner = undefined;
  }

  markPlayerAsReadyToStart = (playerId) => this.players[playerId].readyToStart = true;
  isReadyToStart = () => Object.keys(this.players).every(key => this.players[key].readyToStart === true);
  start = () => {
    const playersIds = Object.keys(this.players);
    Math.random() > 0.5 ? this.currentTurnPlayerId = playersIds[0] : this.currentTurnPlayerId = playersIds[1];
    const figureRnd = Math.random();
    this.players[playersIds[0]].figure = figureRnd > 0.5 ? "X" : "O";
    this.players[playersIds[1]].figure = figureRnd > 0.5 ? "O" : "X";
  }
  makePlay = (playerId, cell) => {
    if (this.currentTurnPlayerId !== playerId) throw new Error("invalid move, not your turn");
    this.map[cell] = this.players[playerId].figure;
    const nextTurnPlayerId = Object.keys(this.players).find(playerId => playerId !== this.currentTurnPlayerId);
    this.currentTurnPlayerId = nextTurnPlayerId;
    this.checkIfSomeoneWon();
  }
  checkIfSomeoneWon = () => {
    const xMoves = Object.keys(this.map).filter(key => this.map[key] === "X");
    const oMoves = Object.keys(this.map).filter(key => this.map[key] === "O");
    if (xMoves.length >= 3 || oMoves.length >= 3) {
      for (const winningCombo of winningCombos) {
        if (winningCombo.every(cell => xMoves.includes(cell))) {
          this.winner = Object.keys(this.players).find(key => this.players[key].figure === "X");
          this.currentTurnPlayerId = null;
          return;
        }
        if (winningCombo.every(cell => oMoves.includes(cell))) {
          this.winner = Object.keys(this.players).find(key => this.players[key].figure === "O");
          this.currentTurnPlayerId = null;
          return;
        }
      }
    }
    if (xMoves.length + oMoves.length === 9) {
      this.result = { draw: "draw "};
      this.currentTurnPlayerId = null;
      return;
    }
  }
  voteToPlayAgain = (playerId) => {
    this.players[playerId].wantsToPlayAgain = true;
  }

  playersWantToPlayAgain = () => {
    return Object.keys(this.players).every(playerId => this.players[playerId].wantsToPlayAgain);
  }

  reset = () => {
    const players = Object.values(this.players);
    const figureRnd = Math.random();
    players[0].figure = figureRnd > 0.5? "X" : "O";
    players[1].figure = figureRnd > 0.5? "O" : "X";
    const turnRnd = Math.random();
    this.currentTurnPlayerId = turnRnd > 0.5? players[0].id : players[1].id;
    players[0].wantsToPlayAgain = undefined;
    players[1].wantsToPlayAgain = undefined;
    this.map = newMap();
    this.result = undefined;
    this.winner = undefined;
  }

}
const gameService = require("../services/game");
const lobbyService = require("../services/lobby");
const emitToWholeRoom = require("../utils/emitToWholeRoom");

module.exports = (socket) => {
  socket.on("player is ready", ({ gameId, playerId }) => {
    socket.join(gameId);
    const game = gameService.findById(gameId);
    const lobby = lobbyService.findById(gameId);
    game.markPlayerAsReadyToStart(playerId);
    if (game.isReadyToStart()) {
      game.start(lobby.players);
      emitToWholeRoom(socket, gameId, "game started", { game });
    }
  });
  socket.on("player rolled", ({ gameId, playerId }) => {
    const game = gameService.findById(gameId);
    game.roll(playerId);
    emitToWholeRoom(socket, gameId, "player rolled", { game });
  });
  socket.on("player passed", ({ gameId, playerId }) => {
    const game = gameService.findById(gameId);
    game.pass(playerId);
    if (game.gameEnded()) {
      emitToWholeRoom(socket, gameId, "game ended", { result: game.result });
    } else {
      emitToWholeRoom(socket, gameId, "player passed", { game });
    }
  });
  socket.on("player voted to play again", ({ gameId, playerId }) => {
    const game = gameService.findById(gameId);
    game.voteToPlayAgain(playerId);
    if (game.playersWantToPlayAgain()) {
      game.reset();
      game.start();
      emitToWholeRoom(socket, gameId, "game started", { game });
    }
  });
  socket.on("return to lobby", ({ gameId }) => {
    gameService.deleteById(gameId);
    const lobby = lobbyService.findById(gameId);
    lobby.game = undefined;
    lobby.gameInProgress = false;
    emitToWholeRoom(socket, gameId, "return to lobby", { lobbyId: gameId });
  })
};

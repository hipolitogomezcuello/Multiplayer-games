const gameService = require("../services/game");
const lobbyService = require("../services/lobby");
const emitToWholeRoom = require("../utils/emitToWholeRoom");

module.exports = (socket) => {
  socket.on("player is ready", ({ gameId, playerId }) => {
    socket.join(gameId);
    const game = gameService.findById(gameId);
    game.markPlayerAsReadyToStart(playerId);
    if (game.isReadyToStart()) {
      game.start();
      emitToWholeRoom(socket, gameId, "game started", { game });
    }
  });

  socket.on("make a play", (data) => {
    const game = gameService.findById(data.gameId);
    game.makePlay(data.playerId, data.cell);
    socket
      .to(data.gameId)
      .emit("player made a play", {
        figure: game.players[data.playerId].figure,
        cell: data.cell,
        currentTurnPlayerId: game.currentTurnPlayerId,
      });
    if (game.winner) {
      emitToWholeRoom(socket, data.gameId, "game ended", {
        result: { winner: game.winner },
      });
    }
    if (game.result && game.result.draw) {
      emitToWholeRoom(socket, data.gameId, "game ended", {
        result: { draw: "draw" },
      });
    }
  });

  socket.on("vote to play again", ({ gameId, playerId }) => {
    const game = gameService.findById(gameId);
    game.voteToPlayAgain(playerId);
    if (game.playersWantToPlayAgain()) {
      game.reset();
      emitToWholeRoom(socket, gameId, "play again", { game });
    } else {
      emitToWholeRoom(socket, gameId, "player wants to play again", {
        playerId,
      });
    }
  });

  socket.on("return to lobby", ({ gameId }) => {
    gameService.deleteById(gameId);
    const lobby = lobbyService.findById(gameId);
    lobby.game = undefined;
    lobby.gameInProgress = false;
    emitToWholeRoom(socket, gameId, "return to lobby", { lobbyId: gameId });
  });
};

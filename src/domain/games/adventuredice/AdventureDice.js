const shuffle = require("../../../utils/shuffle");
const Bag = require("./Bag");

module.exports = class AdventureDice {
  constructor(id, players) {
    this.POSSIBLE_PLAYCOUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.id = id;
    this.title = "Adventure Dice";
    this.name = "adventuredice";
    this.players = [...Object.values(players)];
    this.currentTurnPlayerId = null;
    this.bag = new Bag();
    this.result = undefined;
  }

  joinPlayer = (player) => {
    this.players.push(player);
  }

  removePlayer = (playerId) => {
    this.players = this.players.filter(iPlayer => iPlayer.id !== playerId);
  }

  markPlayerAsReadyToStart = (playerId) =>
    (this.findPlayerById(playerId).readyToStart = true);

  isReadyToStart = () =>
    this.players.every(
      player => player.readyToStart === true
    );
  start = () => {
    if (!this.POSSIBLE_PLAYCOUNTS.includes(this.players.length))
      throw new Error("Incorrect playcount to start the game.");
    this.players = shuffle(this.players);
    this.currentTurnPlayerId = this.players[0].id;
    for (const player of this.players) {
      player.dice = [];
      player.lives = 3;
      player.stars = 0;
      player.gambledStars = 0;
      player.wantsToPlayAgain = undefined;
    }
  };
  roll = (playerId) => {
    if (playerId !== this.currentTurnPlayerId)
      throw new Error("It's not this player's turn.");
    const player = this.findPlayerById(playerId);
    if (player.lives <= 0)
      throw new Error("Player cannot roll, because they're dead.");
    //Remove non reroll dice
    player.dice = player.dice.filter((dice) => dice.result === "reroll");
    //Grab dice until player has 3
    while (player.dice.length < 3 && !this.bag.isEmpty()) {
      player.dice.push(this.bag.grabRandomDice());
    }
    //Roll the dice and activate effects
    for (const dice of player.dice) {
      const result = dice.roll();
      if (result === "dmg") {
        player.lives--;
      } else if (result === "star") {
        player.gambledStars++;
      }
    }
  };
  pass = (playerId) => {
    if (playerId !== this.currentTurnPlayerId)
      throw new Error("It's not this player's turn.");
    const player = this.findPlayerById(playerId);
    if (player.lives > 0) {
      player.stars = player.stars + player.gambledStars;
    }
    this.passTurn(playerId)
  };
  reset = () => {
    this.result = undefined;
    this.currentTurnPlayerId = null;
    this.bag.reset();
    for (const player of this.players) {
      player.dice = [];
      player.lives = 3;
      player.stars = 0;
      player.gambledStars = 0;
    }
  };
  passTurn = (playerId) => {
    const player = this.findPlayerById(playerId);
    player.gambledStars = 0;
    player.lives = 3;
    player.dice = [];
    this.bag.reset();
    this.checkForGameEnded();
    if (!this.gameEnded()) {
      const lastPlayerIndex = this.players.length - 1;
      for (const index in this.players) {
        const i = parseInt(index);
        if (this.currentTurnPlayerId === this.players[i].id) {
          if (i === lastPlayerIndex) {
            this.currentTurnPlayerId = this.players[0].id;
          } else {
            this.currentTurnPlayerId = this.players[i + 1].id;
          }
          break;
        }
      }
    }
  };
  checkForGameEnded = () => {
    if (this.result) return;
    const lastPlayer = this.players[this.players.length - 1];
    if (
      this.currentTurnPlayerId === lastPlayer.id &&
      this.players.some((player) => player.stars >= 13)
    ) {
      const playersCopy = [...this.players];
      playersCopy.sort((playerA, playerB) => {
        if (playerA.stars > playerB.stars) {
          return -1;
        } else {
          return 1;
        }
      });
      const winners = [];
      for (const player of playersCopy) {
        if (winners.length === 0 || winners[0].stars === player.stars) {
          winners.push(player);
        } else {
          break;
        }
      }
      this.result = { winners };
    }
  };
  gameEnded = () => {
    if (this.result) return true;
    return false;
  };

  voteToPlayAgain = (playerId) => {
    this.findPlayerById(playerId).wantsToPlayAgain = true;
  };

  playersWantToPlayAgain = () => {
    return this.players.every(
      (player) => player.wantsToPlayAgain
    );
  };

  findPlayerById = (playerId) => {
    return this.players.find(i => i.id === playerId);
  }
};

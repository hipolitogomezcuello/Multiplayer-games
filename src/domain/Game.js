const { v4: uuidv4 } = require('uuid');

module.exports = class Game {
  constructor(name, players, id) {
    this.name = name,
    this.players = players,
    this.id = id || uuidv4();
  }

  
}
const { v4: uuidv4 } = require('uuid');

const players = {}

module.exports =  {
  create: (username) => {
    const id = uuidv4();
    players[id] = {
      id,
      username
    }
    return players[id];
  },
  findAll: () => {
    return Object.values(players);
  },
}
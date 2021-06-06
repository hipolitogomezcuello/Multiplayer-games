const Dice = require("./Dice");
const getRandomInt = require("../../../utils/getRandomInt");

const createRedDice = () =>
  new Dice(["dmg", "dmg", "dmg", "reroll", "reroll", "star"], "red");
const createYellowDice = () =>
  new Dice(["dmg", "dmg", "reroll", "reroll", "star", "star"], "orange");
const createGreenDice = () =>
  new Dice(["dmg", "reroll", "reroll", "star", "star", "star"], "green");
const createNewSetOfDice = () => [
  createGreenDice(),
  createGreenDice(),
  createGreenDice(),
  createGreenDice(),
  createGreenDice(),
  createGreenDice(),
  createYellowDice(),
  createYellowDice(),
  createYellowDice(),
  createYellowDice(),
  createRedDice(),
  createRedDice(),
  createRedDice(),
];

class Bag {
  constructor() {
    this.dice = createNewSetOfDice();
  }

  grabRandomDice = () => {
    if (this.dice.length <= 0)
      throw new Error("Cant grab a dice, bag is empty");
    const rndIndex = getRandomInt(0, this.dice.length - 1);
    return this.dice.splice(rndIndex, 1)[0];
  };

  reset = () => (this.dice = createNewSetOfDice());

  isEmpty = () => this.dice.length === 0;
}

module.exports = Bag;

const getRandomInt = require("../../../utils/getRandomInt");

class Dice {
  constructor(faces, color) {
    if (faces.length !== 6) throw new Error("Invalid faces for D6");
    this.faces = faces;
    this.color = color;
    this.result = faces[0];
  }

  roll = () => {
    this.result = this.faces[getRandomInt(0, 5)];
    return this.result;
  };
}

module.exports = Dice;

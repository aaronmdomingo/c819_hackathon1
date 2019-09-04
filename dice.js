/*
DICE ROLL VALUES
  SpeedUpDown = #1F40E, 1F434;
  Weapon = #1F5E1;
*/

class Dice {
  constructor(diceCount) {
    this.diceDom = null;
    this.diceContainer = null;
    this.possibleValues = ['fortune', 'weapon', 'giddyUp', 'speedUpDown', 'laneChange', 'fortune'];
    this.currentValues = [];
    this.diceCount = diceCount;
  }
  renderDice() {
    this.diceContainer = $('.main__DiceContainer');
    this.diceContainer.empty();
    var tempDiceValues = [];
    for (var dieIndex = 0 ; dieIndex < this.diceCount ; dieIndex++) {
      var randomIndex = Math.floor(Math.random() * this.possibleValues.length);
      var randomValue = this.possibleValues[randomIndex];

      this.diceDom = $('<div>', {
        class: 'diceBox'
      })

      switch (randomValue) {
        case 'fortune':
          this.diceDom.addClass('fortune');
          break;
        case 'weapon':
          this.diceDom.addClass('weapon');
          break;
        case 'giddyUp':
          this.diceDom.addClass('giddyUp');
          break;
        case 'speedUpDown':
          this.diceDom.addClass('speedUpDown');
          break;
        case 'laneChange':
          this.diceDom.addClass('laneChange');
          break;
        default:
          console.log('Dice value not found');
      }

      tempDiceValues.push(randomValue);
      this.diceContainer.append(this.diceDom);
    }
    this.currentValues = tempDiceValues;
    return tempDiceValues;
  }

  // rollPossibleDice() {
  //   var tempDiceValues = [];
  //   for (var dieIndex = 0 ; dieIndex < this.diceCount ; dieIndex++) {
  //     var randomIndex = Math.floor(Math.random()*this.possibleValues.length);
  //     var randomValue = this.possibleValues[randomIndex];

  //     switch (randomValue) {
  //       case 'fortune':
  //         this.diceDom[dieIndex].addClass
  //     }
  //   }
  // }
}

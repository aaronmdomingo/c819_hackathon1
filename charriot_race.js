class ChariotRace {
  constructor(){
    this.rollDice = this.rollDice.bind(this)
    this.players = [];
    this.currentPlayer = 0;
    this.dice = new Dice(5)

  }

  addPlayer (name){
    var newPlayer = new Player(name, 12, 4, 3)
    this.players.push(newPlayer);
    newPlayer.render();
    this.players[this.currentPlayer].markCurrentTurn();
  }

  addEventListeners(){
    $('#diceRoll').click(this.rollDice);
  }

  rollDice() {
    var currentPlayer = this.players[this.currentPlayer];
    var diceValuesArray = this.players[this.currentPlayer].diceValues;
    var fortuneValue = 0;
    var speedValue = 0;
    var healthValue = 0;
    var weaponValue = 0;
    var laneChangeValue = 0;

    diceValuesArray = this.dice.renderDice();
    console.log(diceValuesArray);

    for (var valIndex = 0 ; valIndex < diceValuesArray.length ; valIndex++) {
      var diceValue = diceValuesArray[valIndex];

      switch (diceValue) {
        case 'fortune':
          fortuneValue++
          break;
        case 'giddyUp':
          speedValue += 2;
          healthValue--
          break;
        case 'laneChange':
          laneChangeValue++
          break;
        case 'speedUpDown':
          speedValue++
          break;
        case 'weapon':
          weaponValue++
          break;
        default:
          console.log(`That's not an item!`)
          break;

      }
    }
    console.log('fortune', fortuneValue);
    console.log('speed', speedValue);
    console.log('health', healthValue);
    console.log('weapon', weaponValue);
    console.log('laneChange', laneChangeValue);

    currentPlayer.updateHealth(healthValue);
    currentPlayer.updateSpeed(speedValue);
    currentPlayer.updateFortune(fortuneValue);
    this.goNextPlayer();

    //UPDATE PLAYER CARDS!!!!

  }

  goNextPlayer() {
    this.players[this.currentPlayer].unmarkCurrentTurn();
    this.currentPlayer++
    if (this.currentPlayer === this.players.length) {
      this.currentPlayer = 0;
    }
    this.players[this.currentPlayer].markCurrentTurn();
  }



}

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
  }

  addEventListeners(){
    $('#diceRoll').click(this.rollDice);
  }

  rollDice() {
    this.dice.renderDice();
  }



}

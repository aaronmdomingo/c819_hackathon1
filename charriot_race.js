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
    this.dice.renderDice();
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

class ChariotRace {
  constructor(){
    this.rollDice = this.rollDice.bind(this)
    this.players = [];
    this.lanes = [

    ]
    this.domElements = {
      trackContainer: $(".game__TracksContainer")
    }
    this.currentPlayer = 0;
    this.dice = new Dice(5);
  }

  addPlayer (name, extraClass, lane, box){
    var newPlayer = new Player(name, 12, 4, 3, extraClass, lane, box)
    this.players.push(newPlayer);
    var playerDomElements = newPlayer.render();
    $('.game__TracksContainer').append(playerDomElements.track);
    $('.main__PlayerContainer').append(playerDomElements.info);
    this.players[this.currentPlayer].markCurrentTurn();
    this.displayPlayer( this.players.length-1);

  }


  addTrack(laneCount, trackLength) {
    debugger;
    for( var laneIndex = 0; laneIndex < laneCount; laneIndex++){
      var thisLanesTrack = [];
      var trackContainer = $("<div>", {
        class: 'trackRow'
      })
      for (var trackIndex = 0; trackIndex < trackLength; trackIndex++) {
        var trackBox = $('<div>', {
          class: 'trackBox',
          'data-position': trackIndex + 1
        })
        thisLanesTrack.push(trackBox);
        trackContainer.append(trackBox);
      }
      this.lanes.push(thisLanesTrack);
      this.domElements.trackContainer.append(trackContainer);
    }

  }

  addEventListeners(){
    $('#diceRoll').click(this.rollDice);
    // $('.trackBox').click(this.move);
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
    // console.log('fortune', fortuneValue);
    // console.log('speed', speedValue);
    // console.log('health', healthValue);
    // console.log('weapon', weaponValue);
    // console.log('laneChange', laneChangeValue);

    currentPlayer.updateHealth(healthValue);
    currentPlayer.updateSpeed(speedValue);
    currentPlayer.updateFortune(fortuneValue);
    // this.move();
    this.goNextPlayer();
    this.checkheal();

  }

  goNextPlayer() {
    this.players[this.currentPlayer].unmarkCurrentTurn();
    this.currentPlayer++
    if (this.currentPlayer === this.players.length) {
      this.currentPlayer = 0;
    }
    this.players[this.currentPlayer].markCurrentTurn();
  }

  checkheal() {
    var currentPlayer = this.players[this.currentPlayer];
    var currentName = this.players[this.currentPlayer].name;
    if (currentPlayer.points.health < 10 && currentPlayer.points.fortune > 3) {
      if (confirm(`${currentName}, you have enough fortune to heal for 3 health! Do you want to heal?`)) {
        currentPlayer.updateHealth(3);
        currentPlayer.updateFortune(-3);
      }
    }
  }
  displayPlayer( playerIndex){
    if(playerIndex===undefined){
      playerIndex = this.currentPlayer;
    }
    var currentPlayer = this.players[playerIndex]
    var currentImage = currentPlayer.getImage();
    $('.'+currentImage).removeClass(currentImage);
    var playerPosition = currentPlayer.getPosition();
    this.lanes[playerPosition.lane][playerPosition.box].addClass(currentImage);
  }
  moveCurrentPlayer(lane, box) {
    var currentPlayer = this.players[this.currentPlayer];
    currentPlayer.setPosition(lane, box);
    this.displayPlayer();

  }

}

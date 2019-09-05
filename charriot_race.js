class ChariotRace {
  constructor(){
    this.rollDice = this.rollDice.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.availableMoves = 0;
    this.players = [];
    this.lanes = []
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
    $('#buttonRight').click(this.moveRight)
    $('#buttonUp').click(this.moveUp);
    $('#buttonDown').click(this.moveDown);
    // $('.trackBox').click(this.move);
  }

  rollDice() {
    $('.main__Buttons').css('pointer-events', 'auto');
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
    currentPlayer.weapon = weaponValue;
    currentPlayer.laneChange = laneChangeValue;
    $('#diceRoll').css('pointer-events', 'none');

    // this.moveCurrentPlayer(0, currentPlayer.points.speed);
    // this.goNextPlayer();
    // this.checkheal();

  }

  goNextPlayer() {
    $('.main__Buttons').css('pointer-events', 'none');
    $('#diceRoll').css('pointer-events', 'auto');
    this.players[this.currentPlayer].unmarkCurrentTurn();
    this.currentPlayer++
    if (this.currentPlayer === this.players.length) {
      this.currentPlayer = 0;
    }
    this.checkheal();
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
    if (box >= 14) {
      currentPlayer.lapAmount++
      console.log('current player lap amount', currentPlayer.lapAmount);
      currentPlayer.setPosition(lane, 0);
    } else {
      currentPlayer.setPosition(lane, box);
    }
    this.displayPlayer();
  }

  moveUp() {
    var currentPlayer = this.players[this.currentPlayer];
    var playerPosition = currentPlayer.getPosition();
    var currentLane = playerPosition['lane'];
    var currentBox = playerPosition['box'];
    var currentSpeed = this.players[this.currentPlayer].points.speed;
    var currentLaneChange = currentPlayer.laneChange;
    console.log(currentLaneChange);

    if (currentLaneChange > 0) {
      if (currentLane === 0) {
        game.moveCurrentPlayer(currentLane + 1, currentBox);
        playerPosition['lane'] = currentLane + 1;
      } else {
        game.moveCurrentPlayer(currentLane - 1, currentBox);
        playerPosition['lane'] = currentLane - 1;
      }

      playerPosition['box'] = currentBox;
      this.availableMoves++
      currentPlayer.laneChange--
    } else {
      return;
    }

    if (this.availableMoves === currentSpeed) {
      this.availableMoves = 0;
      this.goNextPlayer();
    }

    this.checkWinCondition();
  }

  moveRight() {
    var currentPlayer = this.players[this.currentPlayer];
    var playerPosition = currentPlayer.getPosition();
    var currentLane = playerPosition['lane'];
    var currentBox = playerPosition['box'];
    var currentSpeed = this.players[this.currentPlayer].points.speed
    var currentWeaponAmount = currentPlayer.weapon;

    game.moveCurrentPlayer(currentLane, currentBox + 1);
    playerPosition['lane'] = currentLane;
    playerPosition['box'] = currentBox + 1;
    this.availableMoves++

    if (this.availableMoves === currentSpeed) {
      this.availableMoves = 0;
      this.goNextPlayer();
    }

    this.checkWinCondition();
  }

  moveDown() {
    var currentPlayer = this.players[this.currentPlayer];
    var playerPosition = currentPlayer.getPosition();
    var currentLane = playerPosition['lane'];
    var currentBox = playerPosition['box'];
    var currentSpeed = this.players[this.currentPlayer].points.speed;
    var currentLaneChange = currentPlayer.laneChange;
    console.log(currentLaneChange);

    if (currentLaneChange > 0) {
      if (currentLane === 0) {
        game.moveCurrentPlayer(currentLane + 1, currentBox);
        playerPosition['lane'] = currentLane + 1;
      } else {
        game.moveCurrentPlayer(currentLane - 1, currentBox);
        playerPosition['lane'] = currentLane - 1;
      }

      playerPosition['box'] = currentBox;
      this.availableMoves++
      currentPlayer.laneChange--
    } else {
      return;
    }

    if (this.availableMoves === currentSpeed) {
      this.availableMoves = 0;
      this.goNextPlayer();
    }

    this.checkWinCondition();
  }

  checkWinCondition() {
    var currentLaps = this.players[this.currentPlayer].lapAmount;

    if (currentLaps === 2) {
      console.log('You Won!')
    }

  }


  // playerMovement() {
  //   var currentPlayer = this.players[this.currentPlayer];
  //   var playerPosition = currentPlayer.getPosition();
  //   var currentLane = playerPosition['lane'];
  //   var currentBox = playerPosition['box'];
  //   var currentSpeed = this.players[this.currentPlayer].points.speed
  //   var movementCount = 0;

  //   document.addEventListener('keydown', function (e) {
  //     var key = e.key;
  //     switch (key) {
  //       case 'ArrowRight':
  //         game.moveCurrentPlayer(currentLane, currentBox + 1);
  //         playerPosition['lane'] = currentLane;
  //         playerPosition['box'] = currentBox + 1;
  //         key = '';
  //         break;
  //       case 'ArrowUp':
  //         if (currentLane === 0) {
  //           game.moveCurrentPlayer(currentLane + 1, currentBox);
  //           playerPosition['lane'] = currentLane + 1;
  //           playerPosition['box'] = currentBox;
  //         } else {
  //           game.moveCurrentPlayer(currentLane - 1, currentBox);
  //           playerPosition['lane'] = currentLane - 1;
  //           playerPosition['box'] = currentBox;
  //         }
  //         break;
  //       case 'ArrowDown':
  //         if (currentLane === 1) {
  //           game.moveCurrentPlayer(currentLane - 1, currentBox);
  //           playerPosition['lane'] = currentLane;
  //           playerPosition['box'] = currentBox + 1;
  //         } else {
  //           game.moveCurrentPlayer(currentLane + 1, currentBox);
  //           playerPosition['lane'] = currentLane;
  //           playerPosition['box'] = currentBox + 1;
  //         }
  //     }
  //   })



}

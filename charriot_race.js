class ChariotRace {
  constructor(){
    this.rollDice = this.rollDice.bind(this);
    this.playerMovement = this.playerMovement.bind(this);
    this.placeTrap = this.placeTrap.bind(this);
    this.availableMoves = 0;
    this.players = [];
    this.lanes = []
    this.domElements = {
      trackContainer: $(".game__TracksContainer")
    }
    this.currentPlayer = 0;
    this.dice = new Dice(5);
    this.tempMove = null;
    this.tempLaneChange = null;
    this.tempWeapon = null;
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
    $('#buttonRight').click(this.playerMovement)
    $('#buttonUp').click(this.playerMovement);
    $('#buttonDown').click(this.playerMovement);
    $('#buttonTrap').click(this.placeTrap);
    $('.close').on('click', function() {
      $('#modal1').hide();
      location.reload();
    })
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
    var speedUpDownValue = 0;

    diceValuesArray = this.dice.renderDice();

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
          speedUpDownValue++
          break;
        case 'weapon':
          weaponValue++
          break;
        default:
          console.log(`That's not an item!`)
          break;

      }
    }

    currentPlayer.updateHealth(healthValue);
    currentPlayer.updateSpeed(speedValue);
    currentPlayer.updateFortune(fortuneValue);

    setTimeout(function() {
      if (speedUpDownValue > 0) {
        for (var i = 0; i < speedUpDownValue; i++) {
          var tempSpeed = 0;
          if (confirm(`You rolled for the option to increase or decrease your speed! Press 'Confirm' to increase youre speed and 'Cancel' to decrease your speed`)) {
            tempSpeed++;
            game.tempMove++
            if (game.tempMove > 14) {
              game.tempMove = 14;
            }
          } else {
            tempSpeed--
            game.tempMove--
          }
          currentPlayer.updateSpeed(tempSpeed);
          game.updateTempStats();
        }
      }
    }, 500)

    this.tempWeapon = weaponValue;
    this.tempLaneChange = laneChangeValue;
    this.tempMove = currentPlayer.points.speed;
    currentPlayer.weapon = weaponValue;
    currentPlayer.laneChange = laneChangeValue;
    this.updateTempStats();
    $('#diceRoll').css('pointer-events', 'none');
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
    if(playerIndex === undefined){
      playerIndex = this.currentPlayer;
    }
    var currentPlayer = this.players[playerIndex]
    var currentImage = currentPlayer.getImage();
    $('.game__TracksContainer').find('.'+currentImage).removeClass(currentImage);
    var playerPosition = currentPlayer.getPosition();
    this.lanes[playerPosition.lane][playerPosition.box].addClass(currentImage);
  }

  moveCurrentPlayer(lane, box) {
    var currentPlayer = this.players[this.currentPlayer];
    if (box >= 20) {
      currentPlayer.lapAmount++
      currentPlayer.setPosition(lane, 0);
    } else {
      currentPlayer.setPosition(lane, box);
    }
    this.displayPlayer();
  }

  playerMovement() {
    var currentPlayer = this.players[this.currentPlayer];
    var playerPosition = currentPlayer.getPosition();
    var currentLane = playerPosition['lane'];
    var currentBox = playerPosition['box'];
    var currentSpeed = this.players[this.currentPlayer].points.speed
    var currentWeaponAmount = currentPlayer.weapon;
    var currentLaneChange = currentPlayer.laneChange;
    var currentButton = event.target.id;

    switch (currentButton) {
      case 'buttonRight':
        game.moveCurrentPlayer(currentLane, currentBox + 1);
        playerPosition['lane'] = currentLane;
        playerPosition['box'] = currentBox + 1;
        this.availableMoves++
        break;
      case 'buttonUp':
        if (currentLaneChange > 0) {
          if (currentLane === 1) {
            game.moveCurrentPlayer(currentLane - 1, currentBox);
            playerPosition['lane'] = currentLane - 1;
          }
          playerPosition['box'] = currentBox;
          this.availableMoves++
          currentPlayer.laneChange--
          this.tempLaneChange--
        } else {
          return;
        }
          break;
      case 'buttonDown':
        if (currentLaneChange > 0) {
          if (currentLane === 0) {
            game.moveCurrentPlayer(currentLane + 1, currentBox);
            playerPosition['lane'] = currentLane + 1;
          }
          playerPosition['box'] = currentBox;
          this.availableMoves++
          currentPlayer.laneChange--
          this.tempLaneChange--
        } else {
          return;
        }
        break;
      default:
        console.log('Illegal Move!');
        break;
    }

    if (this.availableMoves === currentSpeed) {
      this.availableMoves = 0;
      this.goNextPlayer();
    }

    this.tempMove--
    this.updateTempStats();
    this.checkForDamage();
    this.checkHealthWinCondition();
    this.checkLapWinCondition();
  }

  checkLapWinCondition() {
    var currentLaps = this.players[this.currentPlayer].lapAmount;

    if (currentLaps === 2) {
      this.winGame();
    }
  }

  checkHealthWinCondition() {
    var playersAlive = null;
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].points.health > 0) {
        playersAlive++
      }
    }

    if (playersAlive === 1) {
      this.winGameThroughDeath();
    }
  }

  placeTrap() {
    var currentPlayer = this.players[this.currentPlayer];
    var currentPlayerClass = currentPlayer.imageClass;
    var weaponAmount = currentPlayer.weapon;

    if (weaponAmount > 0) {
      if ($(`.game__TracksContainer`).find(`.trap.${currentPlayerClass}`).length === 0) {
        $('.game__TracksContainer').find(`.${currentPlayerClass}`).addClass('trap');
        currentPlayer.weapon--
        this.tempWeapon--
        game.updateTempStats();
        this.playSoundMp3('trap');
      }
    } else {
      return;
    }
  }

  checkForDamage() {
    var currentPlayer = this.players[this.currentPlayer];
    var currentPlayerClass = currentPlayer.imageClass;
    var trap = '.trap';

    if($(`.game__TracksContainer`).find(`${trap}.${currentPlayerClass}`).length === 1) {
      this.playSoundWav('trapdamage');
      currentPlayer.updateHealth(-3);
      $(`.game__TracksContainer`).find(`${trap}.${currentPlayerClass}`).addClass('shake');
      $(`.game__TracksContainer`).find(`${trap}.${currentPlayerClass}`).removeClass('trap');

      setTimeout(function() {
        $(`.game__TracksContainer`).find(`${trap}.${currentPlayerClass}`).removeClass('shake');
      }, 1000)
      console.log('You took Damage!')
    }

    if ($(`.game__TracksContainer`).find(`.Player1Image.Player2Image`).length === 1) {
      this.playSoundMp3('bump');
      $(`.game__TracksContainer`).find(`.Player1Image.Player2Image`).addClass('shake');
      for (var i = 0; i < this.players.length ; i++) {
        this.players[i].updateHealth(-1);
      }
      setTimeout(function() {
        $(`.game__TracksContainer`).find(`.Player1Image.Player2Image`).removeClass('shake');
      }, 1000)
    }
  }

  winGame() {
    var winner = this.players[this.currentPlayer].name;
    var winModal = document.getElementById('modal1');
    $('.message').text('Congrats ' + winner + ', you won!');
    $(winModal).show();
    this.playSoundWav('winGame');
  }

  winGameThroughDeath() {
    this.currentPlayer++;
    if (this.currentPlayer > 1) {
      this.currentPlayer = 0;
    }
    var winner = this.players[this.currentPlayer].name;
    var winModal = document.getElementById('modal1');
    $('.message').text('Congrats ' + winner + ', you won!');
    $(winModal).show();
    this.playSoundMp3('die');
  }

  updateTempStats() {
    $('.currentStats-Moves').text(`Moves: ${this.tempMove}`);
    $('.currentStats-Weapons').text(`Weapons: ${this.tempWeapon}`);
    $('.currentStats-LaneChange').text(`Lane Change: ${this.tempLaneChange}`);
  }

  playSoundWav(name) {
    var audio = new Audio(`sounds/${name}.wav`);
    audio.volume = 0.2;
    audio.play();
  }

  playSoundMp3(name) {
    var audio = new Audio(`sounds/${name}.mp3`);
    audio.volume = 0.2;
    audio.play();
  }
}

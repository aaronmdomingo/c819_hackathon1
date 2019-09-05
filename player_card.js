class Player {
  constructor(name, initialHealth, initialSpeed, initialFortune, imageClass, lane, box){
    this.name = name;
    this.maxpoints = {
      speed: 14,
      fortune: 6,
      health: 12
    }
    this.position = {
      lane: lane,
      box: box
    }
    this.weapon = null;
    this.laneChange = null;
    this.lapAmount = null;
    this.imageClass = imageClass;
    this.trackLength = 20;
    this.points = {
      health: initialHealth,
      speed: initialSpeed,
      fortune: initialFortune
    }
    this.diceValues = [];
    this.domElements = {
      container: null,
      name: null,
      healthPoints: null,
      speedPoints: null,
      fortunePoints: null,
      trackContainer: null,
      track: []
    }
  }

  updateHealth(newValue){
    this.changePoints('health', newValue);
  }

  updateSpeed(newValue){
    this.changePoints('speed', newValue);
  }

  updateFortune(newValue){
    this.changePoints('fortune', newValue);
  }

  markCurrentTurn() {
    this.domElements.container.addClass('current');
  }

  unmarkCurrentTurn() {
    this.domElements.container.removeClass('current');
  }

  changePoints(type, newValue){
    var nextValue = this.points[type] + newValue;
    if (nextValue > this.maxpoints[type]){
      nextValue = this.maxpoints[type];
    } else if (nextValue < 0){
      nextValue = 0;
    }
    this.points[type] = nextValue;
    this.update();
  }

  render(){
    this.domElements.container=$('<div>', {
      class: `playerBox ${this.imageClass}`,
    })
    this.domElements.name = $('<div>', {
      class: 'playerBox-Name'
    })
    this.domElements.fortunePoints = $('<div>', {
      class: 'playerBox-Fortune'
    })
    this.domElements.healthPoints = $('<div>', {
      class: 'playerBox-Health'
    })
    this.domElements.speedPoints = $('<div>', {
      class: 'playerBox-Speed'
    })
    // $('.main__PlayerContainer').append(this.domElements.container);
    this.domElements.container.append(this.domElements.name, this.domElements.fortunePoints, this.domElements.healthPoints, this.domElements.speedPoints);

    // var playerOneDom = $('.trackBox.row1Box1').addClass('Player1Image');
    // var playerTwoDom = $('.trackBox.row2Box1').addClass('Player2Image');

    this.update();
    return {
      track: this.domElements.trackContainer,
      info: this.domElements.container
    }
  }

  update(){
    this.clearText();
    this.domElements.name.text(this.name);
    this.domElements.fortunePoints.text('Fortune: ' + this.points.fortune);
    this.domElements.healthPoints.text('Health Points: ' + this.points.health);
    this.domElements.speedPoints.text('Speed: ' + this.points.speed);
  }

  clearText() {
    this.domElements.fortunePoints.text('');
    this.domElements.healthPoints.text('');
    this.domElements.speedPoints.text('');
  }

  getImage(){
    return this.imageClass;
  }

  setPosition( lane, box){
    this.position = {
      lane: lane,
      box: box
    }
  }

  getPosition(){
    return this.position;
  }

}

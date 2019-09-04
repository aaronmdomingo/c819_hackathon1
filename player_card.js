class Player {
  constructor(name, img, initialHealth, initialSpeed, initialFortune){
    this.name = name;
    this.image = img;
    this.maxpoints = {
      speed: 14,
      fortune: 4,
      health: 12
    }
    this.points = {
      health: initialHealth,
      speed: initialSpeed,
      fortune: initialFortune
    }
    this.diceValues = [];
    this.domElements = {
      container: null,
      healthPoints: null,
      speedPoints: null,
      fortunePoints: null
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

  changePoints(type){
    var nextValue = null;
    // check to see if it will increase/decrease
    //check dice values array
    if (nextValue > this.maxpoints[type]){
      nextValue = this.maxpoints[type];
    } else if (nextValue < 0){

    }
    this.update();
  }

  render(){
    this.domElements.container=$('<div>', {
      class: 'playerBox',
    })
    var fortuneContainer = $('<div>', {
      class: 'playerBox-Fortune'
    })
    var healthContainer = $('<div>', {
      class: 'playerBox-Health'
    })
    var speedContainer = $('<div>', {
      class: 'playerBox-Speed'
    })
    $('main__PlayerContainer').append(this.domElements.container);
    this.domElements.container.append(fortuneContainer, healthContainer, speedContainer);
  }

  update(){
    this.domElements.fortunePoints.text(this.points.fortune);
    this.domElements.healthPoints.text(this.points.health);
    this.domElements.speedPoints.text(this.points.speed);
  }
}

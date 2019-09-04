var game;
$(document).ready(startApp)

function startApp(){
  var game = new ChariotRace();

  game.addPlayer('Player 1', 'images')
  game.addPlayer('Player 2', 'images')//add imaages
  game.addEventListeners();

}

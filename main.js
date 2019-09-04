var game;
$(document).ready(startApp)

function startApp(){
  //game = new ChariotRace('#gameArea')
  game.addPlayer('player 1', 'images')
  game.addPlayer('player 2', 'images')//add imaages
  game.addEventListeners();

}

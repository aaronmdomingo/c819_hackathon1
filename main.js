$(document).ready(startApp)
var game;
function startApp(){
  game = new ChariotRace();
  game.addTrack(2, 14);
  game.addPlayer('Player 1', 'Player1Image', 0, 0)
  game.addPlayer('Player 2', 'Player2Image', 1, 0)//add imaages
  game.addEventListeners();

}

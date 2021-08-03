//Importing of necessary packages from the library
const SnakeGame = require('snakecord');

//Snake game using reactions from discord (have to click using mouse)
const snakeGame = new SnakeGame({
    title: 'Snake Game',
    color: "Green",
    timestamp: false,
    gameOverTitle: "Game Over"
});

//Function to initiate Snake game using framework
module.exports = {
	name: 'snake',
	description: 'Reloads a command',
	args: true,
	execute(message, args) {
        console.clear();
        snakeGame.newGame(message);
	},
};
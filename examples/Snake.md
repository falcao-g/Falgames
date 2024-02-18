# **🐍 Snake Game**

```js
const { Snake } = require('falgames');

const Game = new Snake({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Snake Game',
    overTitle: 'Game Over',
    scoreText: '**Score:**'
    color: '#551476'
  },
  emojis: {
    board: '⬛',
    up: '⬆️', 
    down: '⬇️',
    left: '⬅️',
    right: '➡️',
  },
  snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
  foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
  stopButton: 'Stop',
  timeoutTime: 60000,
  playerOnlyMessage: 'Only {player} can use these buttons.'
});

Game.startGame();
Game.on('gameOver', result => {
  console.log(result);  // =>  { result... }
});
```
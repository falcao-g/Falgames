# **🆎 Wordle**

```js
const { Wordle } = require('falgames');

const Game = new Wordle({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Wordle',
    color: '#551476',
  },
  customWord: null,
  timeoutTime: 60000,
  winMessage: 'You won! The word was **{word}**.',
  loseMessage: 'You lost! The word was **{word}**.',
  playerOnlyMessage: 'Only {player} can use these buttons.'
});

Game.startGame();
Game.on('gameOver', result => {
  console.log(result);  // =>  { result... }
});
```
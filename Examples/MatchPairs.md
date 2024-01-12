# **🧩 Match Pairs**

```js
const { MatchPairs } = require('falgames');

const Game = new MatchPairs({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Match Pairs',
    color: '#551476',
    description: '**Click on the buttons to match emojis with their pairs.**'
  },
  timeoutTime: 60000,
  emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
  winMessage: '**You won the Game! You turned a total of `{tilesTurned}` tiles.**',
  loseMessage: '**You lost the Game! You turned a total of `{tilesTurned}` tiles.**',
  playerOnlyMessage: 'Only {player} can use these buttons.'
});

Game.startGame();
Game.on('gameOver', result => {
  console.log(result);  // =>  { result... }
});
```
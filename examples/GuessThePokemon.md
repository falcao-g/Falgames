# **🤔 Guess The Pokemon**

```js
const { GuessThePokemon } = require('falgames');

const Game = new GuessThePokemon({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Who\'s The Pokemon',
    color: '#551476'
  },
  timeoutTime: 60000,
  winMessage: 'You guessed it right! It was a {pokemon}.',
  loseMessage: 'Better luck next time! It was a {pokemon}.',
  errMessage: 'Unable to fetch pokemon data! Please try again.',
  playerOnlyMessage: 'Only {player} can use these buttons.',
  typesText: "Types",
  abilitiesText: "Abilities",
});

Game.startGame();
Game.on('gameOver', result => {
  console.log(result);  // =>  { result... }
});
```
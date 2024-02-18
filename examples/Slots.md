# **🎰 Slot Machine**

```js
const { Slots } = require('falgames');

const Game = new Slots({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Slot Machine',
    color: '#551476'
  },
  slots: ['🍇', '🍊', '🍋', '🍌']
});

Game.startGame();
Game.on('gameOver', result => {
  console.log(result);  // =>  { result... }
});
```
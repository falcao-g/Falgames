# **FALGAMES**

> **Falgames is a powerful npm package with a collection of minigames for your discord bot :)**


## **⚙️ Installation** 
```
npm i falgames@latest
```

## **✨ Features**

- Easy to use.
- Beginner friendly.
- Slash Commands Games.
- Supports Discord.js v14+


## **📚 Usage**
```js
const { Snake } = require('falgames');

const Game = new Snake({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Snake Game',
    overTitle: 'Game Over',
    color: '#5865F2'
  },
  emojis: {
    board: '⬛',
    food: '🍎',
    up: '⬆️', 
    down: '⬇️',
    left: '⬅️',
    right: '➡️',
  },
  stopButton: 'Stop',
  timeoutTime: 60000,
  snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
  foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
  playerOnlyMessage: 'Only {player} can use these buttons.'
});

Game.startGame();
Game.on('gameOver', result => {
  console.log(result);  // =>  { result... }
});
```

## **📜 Credits**

This package is directed inspired by the [Gamecord](https://www.npmjs.com/package/discord-gamecord) package.

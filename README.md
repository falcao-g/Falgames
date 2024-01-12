# **FALGAMES**

> **Falgames is a powerful npm package with a collection of minigames for your discord bot :)**

## **⚙️ Installation**

```bash
npm i falgames@latest
```

## **✨ Features**

- Easy to use.
- Beginner friendly.
- Slash Commands Games.
- Supports Discord.js v14+

## **📚 Usage**

Starting a game with Falgames is as easy as the following example:

```js
const { Snake } = require('falgames');

const Game = new Snake({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Snake Game',
    overTitle: 'Game Over',
    scoreText: '**Score:**'
    color: '#5865F2'
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

Slash commands are also supported, just set the `isSlashGame` option to `true` and the message option to `interaction`:

```js
const { Snake } = require('falgames');

const Game = new Snake({
  message: interaction,
  isSlashGame: true,
  //...
});
```

Make sure to check out the [Examples](Examples) folder for more examples.

## **📜 Credits**

This package is directed inspired by the [Gamecord](https://www.npmjs.com/package/discord-gamecord) package.

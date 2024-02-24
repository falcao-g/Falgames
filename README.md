<h1 align="center"> FALGAMES </h1>

> **Falgames is a helpful package to enhance your discord bot with fun and interactive minigames :)**

<p align="center">
    <a href="https://www.npmjs.com/package/falgames"><img src="https://img.shields.io/npm/v/falgames.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/falgames"><img src="https://img.shields.io/npm/dt/falgames.svg?maxAge=3600" alt="npm downloads" /></a>
    <a title="Support server" href="https://discord.gg/8WrAtVYVKR">
        <img src="https://img.shields.io/discord/742332099788275732.svg?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2&label=Support" alt="Support server">
    </a>
        <a title="Stars" href="https://github.com/falcao-g/falbot">
        <img src="https://img.shields.io/github/stars/falcao-g/Falgames" alt="Stars">
    </a>
</p>

## **✨ Why Falgames?**

- Easy to use & beginner friendly.
- Supports both message and slash commands.
- Customizable to fit your bot's style.
- 18 different minigames to choose from.

## **⚙️ Installation**

Please note that Node v18+ and Discord.js v14+ is required.

```bash
npm i falgames
```

## 📷 Preview

![Preview](/assets/readme.png)

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
    scoreText: '**Score:**',
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

Slash commands are also supported, just set the `isSlashGame` option to `true` and the message option to `interaction`:

```js
const { Snake } = require('falgames');

const Game = new Snake({
  message: interaction,
  isSlashGame: true,
  //...
});
```

Make sure to check out the [examples](examples) folder for more examples.

## **📜 Credits**

This package is directed inspired by the [Gamecord](https://www.npmjs.com/package/discord-gamecord) package.

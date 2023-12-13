# **🎲 Dice Rolling**

```js
const { Roll } = require('falgames');

const Game = new Roll({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Slot Machine',
    color: '#5865F2'
  },
});

Game.roll("1d20")
```
# **🎲 Dice Rolling**

```js
const { Roll } = require('falgames');

const Game = new Roll({
  message: message,
  isSlashGame: false,
  embed: {
    title: 'Dice Roll',
    color: '#5865F2'
  },
  notValidRollMessage: 'Please provide a valid roll.',
  rollLimit: 500,
  rollLimitMessage: 'You can\'t roll this much dice.'
});

Game.roll("1d20")
```
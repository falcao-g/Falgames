const Discord = require('discord.js');
const client = new Discord.Client({ intents: [1, 512, 4096, 32768] });
const { FastType } = require('../index');

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignorar mensagens de bots

  if (message.content === 'fast') {
    const Game = new FastType({
      message: message,
    });

    Game.startGame();
    Game.on('gameOver', result => {
      console.log(result);  // =>  { result... }
    });
  }
});

client.login('YOUR_BOT_TOKEN');

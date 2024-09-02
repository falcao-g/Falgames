const Discord = require('discord.js');
const client = new Discord.Client({ intents: [1, 512, 4096, 32768] });
const { FastType } = require('../index');

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignorar mensagens de bots

  if (message.content === '!fast') {
    const Game = new FastType({
      message: message,
      isSlashGame: false,
      embed: {
        title: 'Fast Type',
        color: '#551476',
        description: 'You have {time} seconds to type the sentence below.',
        sentenceTitle: 'Sentence',
      },
      timeoutTime: 60000,
      sentence: 'Some really cool sentence to fast type.',
      winMessage: 'You won! You finished the type race in {time} seconds with wpm of {wpm}.',
      loseMessage: 'You lost! You didn\'t type the correct sentence in time.',
      timeMessage: 'You lost! You didn\'t type fast enough.',
    });

    Game.startGame();
    Game.on('gameOver', result => {
      console.log(result);  // =>  { result... }
    });
  }
});

client.login('OTAwODcxODk3NzI0NjM3MTg0.Gi5ShA.WvlVVbtFcXIzc89E-WA9VP33b3orLJB_fJJ-G0');

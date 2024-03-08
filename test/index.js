const Discord = require('discord.js');
const client = new Discord.Client({ intents: [ 1, 512, 4096, 32768 ] });
const Falgames = require('../index');

const gameKeys = Object.keys(Falgames);

client.on('messageCreate', async (message) => {
  if (message.content === '!games') {
    return message.reply(`Available games:\n${gameKeys.join('\n')}`);
  }

  // A general command handler for all games that have startGame method.
  const command = message.content.split(' ')[0].slice(1);
  if (!gameKeys.includes(command)) return;
  try {
    const Game = new Falgames[command]({message: message, opponent: message.mentions.users.first()});
    Game.startGame();
  } catch (err) {
    console.log(err);
    return message.reply("An error occurred while starting the game. See the console for more details.");
  }
});

client.login('DISCORD_BOT_TOKEN');
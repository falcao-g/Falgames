const { EmbedBuilder } = require('discord.js');
const events = require('events');


module.exports = class FastType extends events {
  /**
   * Represents a FastType game.
   * @constructor
   * @param {Object} options - The options the FastType game.
   * @param {boolean} [options.isSlashGame=false] - Whether the game is played using slash commands.
   * @param {Object} options.message - The message object associated with the game.
   * @param {Object} [options.embed={}] - The embed options for the game.
   * @param {string} [options.embed.title='Fast Type'] - The title of the embed.
   * @param {string} [options.embed.color='#551476'] - The color of the embed.
   * @param {string} [options.embed.description='You have {time} seconds to type the sentence below.'] - The description of the embed.
   * @param {string} [options.embed.sentenceTitle='Sentence'] - The title of the sentence in the embed.
   * @param {string} [options.sentence='Some really cool sentence to fast type.'] - The sentence to be typed.
   * @param {string} [options.winMessage='You won! You finished the type race in {time} seconds with word per minute of {wpm}.'] - The win message.
   * @param {string} [options.loseMessage='You lost! You didn\'t type the correct sentence in time.'] - The lose message.
   * @param {number} [options.timeoutTime=60000] - The timeout time for the game.
   */
  constructor(options = {}) {

    if (!options.isSlashGame) options.isSlashGame = false;
    if (!options.message) throw new TypeError('NO_MESSAGE: No message option was provided.');
    if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: message option must be an object.');
    if (typeof options.isSlashGame !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: isSlashGame option must be a boolean.');


    if (!options.embed) options.embed = {};
    if (!options.embed.title) options.embed.title = 'Fast Type';
    if (!options.embed.color) options.embed.color = '#551476';
    if (!options.embed.description) options.embed.description = 'You have {time} seconds to type the sentence below.';
    if (!options.embed.sentenceTitle) options.embed.sentenceTitle = 'Sentence';

    if (!options.sentence) options.sentence = 'Some really cool sentence to fast type.';
    if (!options.winMessage) options.winMessage = 'You won! You finished the type race in {time} seconds with word per minute of {wpm}.';
    if (!options.loseMessage) options.loseMessage = 'You lost! You didn\'t type the correct sentence in time.';
    if (!options.timeoutTime) options.timeoutTime = 60000;


    if (typeof options.embed !== 'object') throw new TypeError('INVALID_EMBED: embed option must be an object.');
    if (typeof options.embed.title !== 'string') throw new TypeError('INVALID_EMBED: embed title must be a string.');
    if (typeof options.embed.description !== 'string') throw new TypeError('INVALID_DESCRIPTION: embed description must be a string.');
    if (typeof options.embed.sentenceTitle !== 'string') throw new TypeError('INVALID_TEXT: embed sentenceTitle must be a string.');
    if (typeof options.sentence !== 'string') throw new TypeError('INVALID_SENTENCE: sentence must be a string.');
    if (typeof options.winMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Win message option must be a string.');
    if (typeof options.loseMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Lose message option must be a string.');
    if (typeof options.timeoutTime !== 'number') throw new TypeError('INVALID_TIME: Timeout time option must be a number.');


    super();
    this.options = options;
    this.message = options.message;
    this.timeTaken = null;
    this.wpm = 0;
  }


  async sendMessage(content) {
    if (this.options.isSlashGame) return await this.message.editReply(content);
    else return await this.message.channel.send(content);
  }


  async startGame() {
    if (this.options.isSlashGame || !this.message.author) {
      if (!this.message.deferred) await this.message.deferReply().catch(e => {});
      this.message.author = this.message.user;
      this.options.isSlashGame = true;
    }


    const embed = new EmbedBuilder()
    .setColor(this.options.embed.color)
    .setTitle(this.options.embed.title)
    .setDescription(this.options.embed.description.replace('{time}', (this.options.timeoutTime/1000)))
    .addFields({ name: this.options.embed.sentenceTitle, value: this.options.sentence})
    .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })


    const msg = await this.sendMessage({ embeds: [embed] });
    const startTime = Date.now();

    const filter = (m) => m.author.id === this.message.author.id;
    const collector = this.message.channel.createMessageCollector({ time: this.options.timeoutTime, filter: filter });


    collector.on('collect', (m) => {
      collector.stop();
      this.timeTaken = Math.floor(Date.now() - startTime);
      this.wpm = Math.floor(m.content.trim().length / ((this.timeTaken / 60000) % 60) / 5);
      return this.gameOver(msg, m.content?.toLowerCase().trim() === this.options.sentence.toLowerCase());
    })

    collector.on('end', (_, reason) => {
      this.timeTaken = Math.floor(Date.now() - startTime);
      if (reason === 'time') return this.gameOver(msg, false);
    })
  }


  gameOver(msg, result) {
    const FasttypeGame = { player: this.message.author, timeTaken: Math.floor(this.timeTaken / 1000), wpm: this.wpm };
    const GameOverMessage = result ? this.options.winMessage : this.options.loseMessage;
    this.emit('gameOver', { result: (result ? 'win' : 'lose'), FasttypeGame });


    const embed = new EmbedBuilder()
    .setColor(this.options.embed.color)
    .setTitle(this.options.embed.title)
    .setDescription(GameOverMessage.replace('{time}', Math.floor((this.timeTaken / 1000) % 60)).replace('{wpm}', this.wpm))
    .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })
    .setTimestamp()

    return msg.edit({ embeds: [embed] });
  }
}
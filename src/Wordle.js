const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const words = require('../utils/words.json');
const events = require('events');
const { createCanvas } = require('canvas');


module.exports = class Wordle extends events {
  constructor(options = {}) {

    if (!options.isSlashGame) options.isSlashGame = false;
    if (!options.message) throw new TypeError('NO_MESSAGE: No message option was provided.');
    if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: message option must be an object.');
    if (typeof options.isSlashGame !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: isSlashGame option must be a boolean.');


    if (!options.embed) options.embed = {};
    if (!options.embed.title) options.embed.title = 'Wordle';
    if (!options.embed.color) options.embed.color = '#551476';

    if (!options.customWord) options.customWord = null;
    if (!options.timeoutTime) options.timeoutTime = 60000;
    if (!options.winMessage) options.winMessage = 'You won! The word was **{word}**.';
    if (!options.loseMessage) options.loseMessage = 'You lost! The word was **{word}**.';
    if (!options.errMessage) options.errMessage = 'Unable to fetch wordle data! Please try again.';
    

    if (typeof options.embed !== 'object') throw new TypeError('INVALID_EMBED: embed option must be an object.');
    if (typeof options.embed.title !== 'string') throw new TypeError('INVALID_EMBED: embed title must be a string.');
    if (typeof options.timeoutTime !== 'number') throw new TypeError('INVALID_TIME: Timeout time option must be a number.');
    if (typeof options.winMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Win message option must be a string.');
    if (typeof options.loseMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Lose message option must be a string.');
    if (typeof options.errMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Error message option must be a string.');
    if (options.customWord && typeof options.customWord !== 'string') throw new TypeError('INVALID_WORD: Custom Word must be a string.');
    if (options.customWord && options.customWord.length !== 5) throw new RangeError('INVALID_WORD: Custom Word must be of 5 letters.');   

    super();
    this.options = options;
    this.message = options.message;
    this.word = options.customWord;
    this.guessed = [];
  }


  async sendMessage(content) {
    if (this.options.isSlashGame) return await this.message.editReply(content);
    else return await this.message.channel.send(content);
  }

  getBoardImage() {
    const squareSize = 62;
    const gap = 5;
    const boardDimensions = { width: squareSize * 5 + gap * 6, height: squareSize * 6 + gap * 7 };

    const canvas = createCanvas(boardDimensions.width, boardDimensions.height);
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 30px Sans';
     
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 5; x++) {
        const splittedWord = this.guessed[y] ? this.guessed[y].split('').map(l => l.toLowerCase()) : [];

        // Draw the squares
        if (splittedWord[x] && splittedWord[x] === this.word[x]) ctx.fillStyle = '#558d50';
        else if (this.word.includes(splittedWord[x])) ctx.fillStyle = '#b39f42';
        else if (this.guessed[y]) ctx.fillStyle = '#3a3a3c';
        else ctx.fillStyle = 'transparent';

        // Draw the strokes
        ctx.strokeStyle = this.guessed[y] ? 'transparent' : '#fcfcfc';
        ctx.fillRect(x * (squareSize + gap) + gap, y * (squareSize + gap) + gap, squareSize, squareSize);
        ctx.strokeRect(x * (squareSize + gap) + gap, y * (squareSize + gap) + gap, squareSize, squareSize);

        // Draw the letters
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(splittedWord[x] ? splittedWord[x].toUpperCase() : '', x * (squareSize + gap) + gap + squareSize / 2, y * (squareSize + gap) + gap + squareSize / 2);
      }
    }
    
    return new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'wordle.png' });
  }

  async getWordleWord() {
    const API_URL = 'https://www.nytimes.com/svc/wordle/v2/';
    const firtDate = new Date(2021, 5, 19);
    const randomDate = new Date(
      firtDate.getTime() + Math.random() * (new Date().getTime() - firtDate.getTime()),
    );

    return await fetch(API_URL + this.formatDate(randomDate) + '.json').then(res => res.json()).catch(e => { return null });
  }

  formatDate(date) {
    const year = date.toLocaleString('default', {year: 'numeric'});
    const month = date.toLocaleString('default', {month: '2-digit'});
    const day = date.toLocaleString('default', {day: '2-digit'});

    return [year, month, day].join('-');
  }

  async startGame() {
    if (this.options.isSlashGame || !this.message.author) {
      if (!this.message.deferred) await this.message.deferReply().catch(e => {});
      this.message.author = this.message.user;
      this.options.isSlashGame = true;
    }
    // If a custom word is not provided, fetch a random word from the NYTimes API
    if (!this.word) {
      const obj = await this.getWordleWord();
      if (!obj) return this.sendMessage({ content: this.options.errMessage });

      this.word = obj.solution;
    }
    

    const embed = new EmbedBuilder()
    .setColor(this.options.embed.color)
    .setTitle(this.options.embed.title)
    .setImage('attachment://wordle.png')
    .setFooter({ text: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) });

    const msg = await this.sendMessage({ embeds: [embed], files: [this.getBoardImage()] });
    const filter = (m) => m.author.id === this.message.author.id && m.content.length === 5;
    const collector = this.message.channel.createMessageCollector({ idle: this.options.timeoutTime, filter: filter });


    collector.on('collect', async (m) => {
      const guess = m.content.toLowerCase();
      if (m.deletable) await m.delete().catch(e => {});

      this.guessed.push(guess);
      if (this.word === guess || this.guessed.length > 5) return collector.stop();
      await msg.edit({ embeds: [embed], files: [await this.getBoardImage()] });
    })


    collector.on('end', async (_, reason) => {
      if (reason === 'user' || reason === 'idle') return this.gameOver(msg);
    })
  }


  async gameOver(msg) {
    const WordleGame = { player: this.message.author, word: this.word, guessed: this.guessed };
    const GameOverMessage = this.guessed.includes(this.word) ? this.options.winMessage : this.options.loseMessage;
    this.emit('gameOver', { result: (this.guessed.includes(this.word) ? 'win' : 'lose'), ...WordleGame });


    const embed = new EmbedBuilder()
    .setColor(this.options.embed.color)
    .setTitle(this.options.embed.title)
    .setImage('attachment://wordle.png')
    .addFields({ name: 'Game Over', value: GameOverMessage.replace('{word}', this.word) })
    .setFooter({ text: this.message.author.tag, iconURL: this.message.author.displayAvatarURL() });

    return await msg.edit({ embeds: [embed], files: [await this.getBoardImage()] });
  }
}
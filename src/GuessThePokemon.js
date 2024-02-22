const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const events = require('events');
const { createCanvas, loadImage } = require('canvas');


module.exports = class GuessThePokemon extends events {
  constructor(options = {}) {

    if (!options.isSlashGame) options.isSlashGame = false;
    if (!options.message) throw new TypeError('NO_MESSAGE: No message option was provided.');
    if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: message option must be an object.');
    if (typeof options.isSlashGame !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: isSlashGame option must be a boolean.');


    if (!options.embed) options.embed = {};
    if (!options.embed.title) options.embed.title = 'Who\'s The Pokemon';
    if (!options.embed.color) options.embed.color = '#551476';

    if (!options.timeoutTime) options.timeoutTime = 60000;
    if (!options.winMessage) options.winMessage = 'You guessed it right! It was a {pokemon}.';
    if (!options.loseMessage) options.loseMessage = 'Better luck next time! It was a {pokemon}.';
    if (!options.errMessage) options.errMessage = 'Unable to fetch pokemon data! Please try again.';


    if (typeof options.embed !== 'object') throw new TypeError('INVALID_EMBED: embed option must be an object.');
    if (typeof options.embed.title !== 'string') throw new TypeError('INVALID_EMBED: embed title must be a string.');
    if (typeof options.timeoutTime !== 'number') throw new TypeError('INVALID_TIME: Timeout time option must be a number.');
    if (typeof options.winMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Win Message option must be a string.');
    if (typeof options.loseMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Lose Message option must be a string.');

    super();
    this.options = options;
    this.message = options.message;
    this.pokemon = {};
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

    const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
    const result = await fetch( API_URL + this.randomInt(1, 1025)).then(res => res.json()).catch(e => { return null });
    if (!result) return this.sendMessage({ content: this.options.errMessage });

    this.pokemon.name = result.species.name;
    this.pokemon.types = result.types.map(t => t.type.name);
    this.pokemon.abilities = result.abilities.map(a => a.ability.name);
    this.pokemon.answerImage = result.sprites.other['official-artwork'].front_default;
    this.pokemon.questionImage = await this.createQuestionImage(result.sprites.other['official-artwork'].front_default);

    const embed = new EmbedBuilder()
    .setColor(this.options.embed.color)
    .setTitle(this.options.embed.title)
    .setImage('attachment://question-image.png')
    .addFields({ name: 'Types', value: this.pokemon.types.join(', ') ?? 'No Data', inline: true })
    .addFields({ name: 'Abilities', value: this.pokemon.abilities.join(', ') ?? 'No Data', inline: true })
    .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) });


    const attachment = new AttachmentBuilder(this.pokemon.questionImage, { name: 'question-image.png' });
    const msg = await this.sendMessage({ embeds: [embed], files: [attachment] });

    const filter = (m) => m.author.id === this.message.author.id;
    const collector = this.message.channel.createMessageCollector({ idle: this.options.timeoutTime, filter: filter });


    collector.on('collect', (m) => {
      collector.stop();
      return this.gameOver(msg, m.content?.toLowerCase() === this.pokemon.name.toLowerCase());
    })

    collector.on('end', (_, reason) => {
      if (reason === 'idle') return this.gameOver(msg, false);
    })
  }

  async gameOver(msg, result) {
    const GuessThePokemonGame = { player: this.message.author, pokemon: this.pokemon };
    this.emit('gameOver', { result: result ? 'win' : 'lose', ...GuessThePokemonGame });

    const resultMessage = result ? this.options.winMessage : this.options.loseMessage;

    const embed = new EmbedBuilder()
    .setColor(this.options.embed.color)
    .setTitle(this.options.embed.title)
    .setImage('attachment://answer-image.png')
    .addFields({ name: 'Types', value: this.pokemon.types.join(', ') ?? 'No Data', inline: true })
    .addFields({ name: 'Abilities', value: this.pokemon.abilities.join(', ') ?? 'No Data', inline: true })
    .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) });

    const attachment = new AttachmentBuilder(this.pokemon.answerImage, { name: 'answer-image.png' });
    return msg.edit({ content: resultMessage.replace('{pokemon}', this.pokemon.name), embeds: [embed], files: [attachment] });
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  async createQuestionImage(pokemonImgURL) {
    const size = 475;
    // Create a canvas and draw the pokemon image on it
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const img = await loadImage(pokemonImgURL);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    const pxColor = [0, 0, 0]; // Black color
    // Loop through the image data and change the color of the non-transparent pixels to black
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 10) continue; // skip transparent pixels (alpha < 10)
      data[i] = pxColor[0];
      data[i + 1] = pxColor[1];
      data[i + 2] = pxColor[2];
    }
  
    ctx.putImageData(imageData, 0, 0);
    return canvas.toBuffer();
  }
}
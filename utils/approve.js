const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { formatMessage, ButtonBuilder } = require('./utils');
const events = require('events');


module.exports = class Approve extends events {
  /**
   * Represents a game request.
   * @constructor
   * @param {Object} options - The options for the game request.
   * @param {Object} options.message - The message object associated with the game request.
   * @param {Object} options.opponent - The opponent for the game request.
   * @param {Object} [options.embed={}] - The embed options for the game request.
   * @param {string} [options.embed.title='Game Request'] - The title of the embed.
   * @param {string} [options.embed.color='#551476'] - The color of the embed.
   * @param {string} [options.embed.requestTitle=options.embed.title] - The title of the request embed.
   * @param {string} [options.embed.requestColor=options.embed.color] - The color of the request embed.
   * @param {string} [options.embed.rejectTitle=options.embed.title] - The title of the reject embed.
   * @param {string} [options.embed.rejectColor=options.embed.color] - The color of the reject embed.
   * @param {Object} [options.buttons={}] - The button options for the game request.
   * @param {string} [options.buttons.accept='Accept'] - The label for the accept button.
   * @param {string} [options.buttons.reject='Reject'] - The label for the reject button.
   * @param {number} [options.reqTimeoutTime=30000] - The time for the request timeout.
   * @param {boolean} [options.mentionUser=false] - Whether to mention the user in the request message.
   * @param {string} [options.requestMessage='{player} has invited you for a round of Game.'] - The message to send for the request.
   * @param {string} [options.rejectMessage='The player denied your request for a round of Game.'] - The message to send for the rejection.
   * @param {string} [options.reqTimeoutMessage='Dropped the game as the player did not respond.'] - The message to send for the request timeout.
   */
  constructor(options = {}) {

    if (!options.embed) options.embed = {};
    if (!options.embed.requestTitle) options.embed.requestTitle = options.embed.title;
    if (!options.embed.requestColor) options.embed.requestColor = options.embed.color;
    if (!options.embed.rejectTitle) options.embed.rejectTitle = options.embed.title;
    if (!options.embed.rejectColor) options.embed.rejectColor = options.embed.color;

    if (!options.buttons) options.buttons = {};
    if (!options.buttons.accept) options.buttons.accept = 'Accept';
    if (!options.buttons.reject) options.buttons.reject = 'Reject';

    if (!options.reqTimeoutTime) options.reqTimeoutTime = 30000;
    if (typeof options.mentionUser === 'undefined') options.mentionUser = false;
    if (!options.requestMessage) options.requestMessage = '{player} has invited you for a round of Game.';
    if (!options.rejectMessage) options.rejectMessage = 'The player denied your request for a round of Game.';
    if (!options.reqTimeoutMessage) options.reqTimeoutMessage = 'Dropped the game as the player did not respond.';

    super();
    this.options = options;
    this.message = options.message;
    this.opponent = options.opponent;
  }

  
  async sendMessage(content) {
    if (this.options.isSlashGame) return await this.message.editReply(content);
    else return await this.message.channel.send(content);
  }


  async approve() {
    return new Promise(async resolve => {

      const embed = new EmbedBuilder()
      .setColor(this.options.embed.requestColor)
      .setTitle(this.options.embed.requestTitle)
      .setDescription(formatMessage(this.options, 'requestMessage'));

      const btn1 = new ButtonBuilder().setLabel(this.options.buttons.accept).setCustomId('approve_accept').setStyle('SUCCESS');
      const btn2 = new ButtonBuilder().setLabel(this.options.buttons.reject).setCustomId('approve_reject').setStyle('DANGER');
      const row = new ActionRowBuilder().addComponents(btn1, btn2);

      const content = this.options.mentionUser ? '<@!'+this.opponent.id+'>' : null;
      const msg = await this.sendMessage({ content, embeds: [embed], components: [row], allowedMentions: { parse: ['users'] } });
      const collector = msg.createMessageComponentCollector({ time: this.options.reqTimeoutTime });


      collector.on('collect', async btn => {
        await btn.deferUpdate().catch(e => {});
        if (btn.user.id === this.opponent.id) collector.stop(btn.customId.split('_')[1]);
      })

      collector.on('end', async (_, reason) => {
        if (reason === 'accept') return resolve(msg);

        const embed = new EmbedBuilder()
        .setColor(this.options.embed.rejectColor)
        .setTitle(this.options.embed.rejectTitle)
        .setDescription(formatMessage(this.options, 'rejectMessage'))

        if (reason === 'time') embed.setDescription(formatMessage(this.options, 'reqTimeoutMessage'));
        this.emit('gameOver', { result: reason, player: this.message.author, opponent: this.opponent });
        await msg.edit({ content: null, embeds: [embed], components: [] });
        return resolve(false);
      })
    })
  }


  formatTurnMessage(options, contentMsg) {
    const { message, opponent } = options;
    let player1 = (!this.player1Turn) ? opponent : message.author;
    let content = options[contentMsg];

    content = content.replace('{player.tag}', player1.tag).replace('{player.username}', player1.username).replace('{player}', `<@!${player1.id}>`);
    content = content.replace('{opponent.tag}', opponent.tag).replace('{opponent.username}', opponent.username).replace('{opponent}', `<@!${opponent.id}>`);
    return content;
  }
}


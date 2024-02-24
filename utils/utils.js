const { ButtonBuilder } = require('discord.js');

module.exports = {
  /**
   * Disables the buttons in the components.
   * @param {Object[]} components - The components to disable the buttons.
   * @returns {Object[]} The disabled components.
  */
  disableButtons(components) {
    for (let x = 0; x < components.length; x++) {
      for (let y = 0; y < components[x].components.length; y++) {
        components[x].components[y] = ButtonBuilder.from(components[x].components[y]);
        components[x].components[y].setDisabled(true);
      }
    }
    return components;
  },

  /**
   * Returns the emoji for the number.
   * @param {number} number - The number to get the emoji for.
   * @returns {string} The emoji for the number.
   */
  getNumEmoji(number) {
    const numEmoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    return numEmoji[number];
  },

  /**
   * Formats the message content.
   * @param {Object} options - The options for the message content.
   * @param {Object} options.message - The message object.
   * @param {Object} options.opponent - The opponent object.
   * @param {string} options.contentMsg - The message content to format.
   * @returns {string} The formatted message content.
  */
  formatMessage(options, contentMsg) {
    const { message, opponent } = options;
    let content = options[contentMsg];
    
    content = content.replace('{player.tag}', message.author.tag).replace('{player.username}', message.author.username).replace('{player}', `<@!${message.author.id}>`);
    content = content.replace('{opponent.tag}', opponent?.tag).replace('{opponent.username}', opponent?.username).replace('{opponent}', `<@!${opponent?.id}>`);
    return content;
  },

  /**
   * Decodes the content.
   * @param {string} content - The content to decode.
   * @returns {string} The decoded content.
   */
  decode(content) {
    return require('html-entities').decode(content);
  },

  /**
   * Moves the position based on the direction.
   * @param {Object} pos - The position to move.
   * @param {string} direction - The direction to move.
   * @returns {Object} The new position.
  */
  move(pos, direction) {
    if (direction === 'up') return { x: pos.x, y: pos.y - 1 };
    else if (direction === 'down') return { x: pos.x, y: pos.y + 1 };
    else if (direction === 'left') return { x: pos.x - 1, y: pos.y };
    else if (direction === 'right') return { x: pos.x + 1, y: pos.y }
    else return pos;
  },

  /**
   * Returns the opposite direction.
   * @param {string} direction - The direction to get the opposite for.
   * @returns {string} The opposite direction.
  */
  oppDirection(direction) {
    if (direction === 'up') return 'down';
    else if (direction === 'down') return 'up';
    else if (direction === 'left') return 'right';
    else if (direction === 'right') return 'left';
  },

  /**
   * Returns the alpha emoji for the letter.
   * @param {string} letter - The letter to get the alpha emoji for.
   * @returns {string} The alpha emoji for the letter.
   */
  getAlphaEmoji(letter) {
    const letters = {
      'A': '🇦', 'B': '🇧', 'C': '🇨', 'D': '🇩', 'E': '🇪', 'F': '🇫', 'G': '🇬', 'H': '🇭', 'I': '🇮',
      'J': '🇯', 'K': '🇰', 'L': '🇱', 'M': '🇲', 'N': '🇳', 'O': '🇴', 'P': '🇵', 'Q': '🇶', 'R': '🇷',
      'S': '🇸', 'T': '🇹', 'U': '🇺', 'V': '🇻', 'W': '🇼', 'X': '🇽', 'Y': '🇾', 'Z': '🇿',
    }

    if (letter == 0) return Object.keys(letters).slice(0, 12);
    if (letter == 1) return Object.keys(letters).slice(12, 24);
    return letters[letter];
  },

  /**
   * Shuffles the array.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} The shuffled array.
  */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  },

  /**
   * Returns a random integer between the min and max.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} A random integer between the min and max.
  */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}



module.exports.ButtonBuilder = class buttonBuilder extends ButtonBuilder {
  constructor(options) {
    super(options);
  }

  setStyle(style) {
    this.data.style = (style==='PRIMARY') ? 1 : (style==='SUCCESS') ? 3 : (style==='DANGER') ? 4 : 2;
    return this;
  }

  removeLabel() {
    this.data.label = null;
    return this;
  }

  removeEmoji() {
    this.data.emoji = null;
    return this;
  }
}
const { EmbedBuilder } = require("discord.js")
const events = require("events")

module.exports = class Roll extends events {
	/**
	 * Represents a Roll game.
	 * @constructor
	 * @param {Object} options - The options for the Roll game.
	 * @param {boolean} [options.isSlashGame=false] - Whether the game is played using slash commands.
	 * @param {Object} options.message - The message object associated with the game.
	 * @param {Object} [options.embed={}] - The embed options for the game.
	 * @param {string} [options.embed.title='Dice Roll'] - The title of the embed.
	 * @param {string} [options.embed.color='#551476'] - The color of the embed.
	 * @param {string} [options.notValidRollMessage='Please provide a valid roll.'] - The message to show when an invalid roll is provided.
	 * @param {number} [options.rollLimit=500] - The roll limit.
	 * @param {string} [options.rollLimitMessage='You can\'t roll this many dice.'] - The message to show when the roll limit is exceeded.
	 */
	constructor(options = {}) {
		if (!options.isSlashGame) options.isSlashGame = false
		if (!options.message) throw new TypeError("NO_MESSAGE: No message option was provided.")
		if (typeof options.message !== "object") throw new TypeError("INVALID_MESSAGE: message option must be an object.")
		if (typeof options.isSlashGame !== "boolean")
			throw new TypeError("INVALID_COMMAND_TYPE: isSlashGame option must be a boolean.")

		if (!options.embed) options.embed = {}
		if (!options.embed.title) options.embed.title = "Dice Roll"
		if (!options.embed.color) options.embed.color = "#551476"

		if (!options.notValidRollMessage) options.notValidRollMessage = "Please provide a valid roll."
		if (!options.rollLimit) options.rollLimit = 500
		if (!options.rollLimitMessage) options.rollLimitMessage = "You can't roll this many dice."

		if (typeof options.embed !== "object") throw new TypeError("INVALID_EMBED: embed option must be an object.")
		if (typeof options.embed.title !== "string") throw new TypeError("INVALID_EMBED: embed title must be a string.")
		if (typeof options.notValidRollMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: notValidRollMessage option must be a string.")
		if (typeof options.rollLimit !== "number") throw new TypeError("INVALID_NUMBER: rollLimit option must be a number.")
		if (typeof options.rollLimitMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: rollLimitMessage option must be a string.")

		super()
		this.options = options
		this.message = options.message
	}

	async sendMessage(content) {
		if (this.options.isSlashGame) return await this.message.editReply(content)
		else return await this.message.channel.send(content)
	}

	async roll(expression) {
		if (this.options.isSlashGame || !this.message.author) {
			if (!this.message.deferred) await this.message.deferReply().catch((e) => {})
			this.message.author = this.message.user
			this.options.isSlashGame = true
		}

		try {
			var result = this.calculate(expression)
		} catch (e) {
			await this.sendMessage({ content: this.options.notValidRollMessage })
			return
		}

		if (result.length > this.options.rollLimit) {
			await this.sendMessage({ content: this.options.rollLimitMessage })
			return
		}

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setDescription(result)
			.setFooter({
				text: this.message.author.username,
				iconURL: this.message.author.displayAvatarURL({ dynamic: true }),
			})
		await this.sendMessage({ embeds: [embed] })
	}

	randint(low, high) {
		return Math.floor(Math.random() * (high - low + 1) + low)
	}

	calculate(expressionRaw) {
		var expression = ""
		for (let c = 0; c < expressionRaw.length; c++) {
			if (["+", "-"].includes(expressionRaw[c]) && expressionRaw[c - 1] !== " ") {
				expression += ` ${expressionRaw[c]} `
				continue
			}
			expression += expressionRaw[c]
		}

		const parts = expression.split(" ")
		let result = ""
		let total = 0
		let add = true

		for (let i = 0; i < parts.length; i++) {
			let part = parts[i]
			let matches

			if (part.startsWith("d")) {
				part = "1" + part
			}

			if (part === "+") {
				add = true
				result += ` + `
				continue
			} else if (part === "-") {
				add = false
				result += ` - `
				continue
			}

			if ((matches = part.match(/^(\d+)d(\d+)$/))) {
				let count = parseInt(matches[1])
				let sides = parseInt(matches[2])
				let rolls = []

				for (let j = 0; j < count; j++) {
					let roll = this.randint(1, sides)
					rolls.push(roll)
					if (add) {
						total += roll
					} else {
						total -= roll
					}
				}

				result += part + " ("
				for (let j = 0; j < rolls.length; j++) {
					if (rolls[j] === 1) {
						result += "**" + rolls[j] + "**"
					} else if (rolls[j] === sides) {
						result += "**" + rolls[j] + "**"
					} else {
						result += rolls[j]
					}
					if (j < rolls.length - 1) {
						result += ", "
					}
				}
				result += ")"
			} else if ((matches = part.match(/^\d+$/))) {
				let value = parseInt(part)
				result += value
				if (add) {
					total += value
				} else {
					total -= value
				}
			} else {
				throw new Error("Invalid expression: " + part)
			}
		}

		result += " = " + "`" + total + "`"
		return result
	}
}

import { EmbedBuilder, ActionRowBuilder } from "discord.js"
import { formatMessage, ButtonBuilder, randomInt } from "../utils/utils.js"
import events from "node:events"

/**
 * This class allows you to create and manage a Would You Rather game in Discord, including handling user interactions and game logic.
 * It extends the Node.js `events` module to allow for event-driven programming, specifically emitting a `gameOver` event when the game ends.
 *
 * @class WouldYouRather
 * @param {WouldYouRatherOptions} options - The options for the Would You Rather game.
 *
 * @extends {events}
 * @fires WouldYouRather#gameOver
 * @typedef {Object} WouldYouRatherOptions
 */
export class WouldYouRather extends events {
	/**
	 * Represents a Would You Rather game.
	 * @constructor
	 * @param {Object} options - The options for the Would You Rather game.
	 * @param {boolean} [options.isSlashGame=false] - Whether the game is played using slash commands.
	 * @param {Object} options.message - The message object associated with the game.
	 * @param {Object} [options.embed={}] - The embed options for the game.
	 * @param {string} [options.embed.title='Would You Rather'] - The title of the embed.
	 * @param {string} [options.embed.color='#551476'] - The color of the embed.
	 * @param {Object} [options.buttons={}] - The button options for the game.
	 * @param {string} [options.buttons.option1='Option 1'] - The label for the first button.
	 * @param {string} [options.buttons.option2='Option 2'] - The label for the second button.
	 * @param {string} [options.errMessage='Unable to fetch question data! Please try again.'] - The error message for the game.
	 * @param {string} [options.buttonStyle='PRIMARY'] - The style for the buttons.
	 * @param {string} [options.playerOnlyMessage='Only {player} can use these buttons.'] - The message to show when someone else tries to use the buttons.
	 */
	constructor(options = {}) {
		if (!options.isSlashGame) options.isSlashGame = false
		if (!options.message) throw new TypeError("NO_MESSAGE: No message option was provided.")
		if (typeof options.message !== "object") throw new TypeError("INVALID_MESSAGE: message option must be an object.")
		if (typeof options.isSlashGame !== "boolean")
			throw new TypeError("INVALID_COMMAND_TYPE: isSlashGame option must be a boolean.")

		if (!options.embed) options.embed = {}
		if (!options.embed.title) options.embed.title = "Would You Rather"
		if (!options.embed.color) options.embed.color = "#551476"

		if (!options.buttons) options.buttons = {}
		if (!options.buttons.option1) options.buttons.option1 = "Option 1"
		if (!options.buttons.option2) options.buttons.option2 = "Option 2"
		if (!options.errMessage) options.errMessage = "Unable to fetch question data! Please try again."
		if (!options.buttonStyle) options.buttonStyle = "PRIMARY"

		if (typeof options.embed !== "object") throw new TypeError("INVALID_EMBED: embed option must be an object.")
		if (typeof options.embed.title !== "string") throw new TypeError("INVALID_EMBED: embed title must be a string.")
		if (typeof options.buttons !== "object") throw new TypeError("INVALID_BUTTON: buttons option must be an object.")
		if (typeof options.buttons.option1 !== "string")
			throw new TypeError("INVALID_BUTTON: option1 button must be a string.")
		if (typeof options.buttons.option2 !== "string")
			throw new TypeError("INVALID_BUTTON: option2 button must be a string.")
		if (typeof options.buttonStyle !== "string")
			throw new TypeError("INVALID_BUTTON_STYLE: button style must be a string.")
		if (typeof options.errMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Error message option must be a string.")
		if (options.playerOnlyMessage !== false) {
			if (!options.playerOnlyMessage) options.playerOnlyMessage = "Only {player} can use these buttons."
			if (typeof options.playerOnlyMessage !== "string")
				throw new TypeError("INVALID_MESSAGE: playerOnly Message option must be a string.")
		}

		super()
		this.options = options
		this.message = options.message
		/**
		 * @typedef Data
		 * @type {Object}
		 * @property {number} id - The id of the question.
		 * @property {string} option1 - The first option of the question.
		 * @property {string} option2 - The second option of the question.
		 * @property {number} option1Votes - The votes for the first option.
		 * @property {number} option2Votes - The votes for the second option.
		 */
		/** @type {Data} */
		this.data = null
	}

	async sendMessage(content) {
		if (this.options.isSlashGame) return await this.message.editReply(content)
		else return await this.message.channel.send(content)
	}

	async getWyrQuestion() {
		const API_URL = "https://wouldurather.io/api/question?id="
		return await fetch(API_URL + randomInt(1, 568))
			.then((res) => res.json())
			.catch((e) => {
				return {}
			})
	}

	async startGame() {
		if (this.options.isSlashGame || !this.message.author) {
			if (!this.message.deferred) await this.message.deferReply().catch((e) => {})
			this.message.author = this.message.user
			this.options.isSlashGame = true
		}

		this.data = await this.getWyrQuestion()

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setDescription(`1. ${this.data.option1} \n2. ${this.data.option2}`)
			.setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })

		const btn1 = new ButtonBuilder()
			.setStyle(this.options.buttonStyle)
			.setLabel(this.options.buttons.option1)
			.setCustomId("wyr_1")
			.setEmoji("1️⃣")
		const btn2 = new ButtonBuilder()
			.setStyle(this.options.buttonStyle)
			.setLabel(this.options.buttons.option2)
			.setCustomId("wyr_2")
			.setEmoji("2️⃣")
		const row = new ActionRowBuilder().addComponents(btn1, btn2)

		const msg = await this.sendMessage({ embeds: [embed], components: [row] })
		const collector = msg.createMessageComponentCollector({})

		collector.on("collect", async (btn) => {
			await btn.deferUpdate().catch((e) => {})
			if (btn.user.id !== this.message.author.id) {
				if (this.options.playerOnlyMessage)
					btn.followUp({ content: formatMessage(this.options, "playerOnlyMessage"), ephemeral: true })
				return
			}

			collector.stop()
			return this.gameOver(msg, btn.customId.split("_")[1])
		})
	}

	async gameOver(msg, result) {
		const WouldYouRatherGame = {
			player: this.message.author,
			question: this.data,
			selected: this.data["option" + result],
		}
		this.emit("gameOver", { result: "finish", ...WouldYouRatherGame })

		const prnt1 = Math.floor(
			(parseInt(this.data.option1Votes) / (parseInt(this.data.option1Votes) + parseInt(this.data.option2Votes))) * 100
		)
		const prnt2 = Math.floor(
			(parseInt(this.data.option2Votes) / (parseInt(this.data.option1Votes) + parseInt(this.data.option2Votes))) * 100
		)

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })

		if (result === "1")
			embed.setDescription(`**1. ${this.data.option1} (${prnt1}%)**\n2. ${this.data.option2} (${prnt2}%)`)
		else embed.setDescription(`1. ${this.data.option1} (${prnt1}%)\n**2. ${this.data.option2} (${prnt2}%)**`)

		return await msg.edit({ embeds: [embed], components: [] })
	}
}

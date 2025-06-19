import { EmbedBuilder, ActionRowBuilder, time } from "discord.js"
import { formatMessage, shuffleArray, disableButtons, ButtonBuilder } from "../utils/utils.js"
const difficulties = ["easy", "medium", "hard"]
import events from "node:events"
import { decode } from "html-entities"

/**
 * This class allows you to create and manage a Trivia game in Discord, including handling user interactions and game logic.
 * It extends the Node.js `events` module to allow for event-driven programming, specifically emitting a `gameOver` event when the game ends.
 *
 * @class Trivia
 * @param {TriviaOptions} options - The options for the Trivia game.
 *
 * @extends {events}
 * @fires Trivia#gameOver
 * @typedef {Object} TriviaOptions
 */
export class Trivia extends events {
	/**
	 * Represents a Trivia game.
	 * @constructor
	 * @param {Object} options - Options to set for the Trivia game.
	 * @param {Object} options.message - The message object associated with the game.
	 * @param {boolean} [options.isSlashGame=false] - Whether the game is played using slash commands.
	 * @param {Object} [options.embed] - The embed options for the game.
	 * @param {string} [options.embed.title='Trivia'] - The title of the embed.
	 * @param {string} [options.embed.color='#551476'] - The color of the embed.
	 * @param {string} [options.embed.description='You have 60 seconds to guess the answer.'] - The description of the embed.
	 * @param {string} [options.mode='multiple'] - The mode of the trivia game. Can be 'multiple' or 'single'.
	 * @param {number} [options.timeoutTime=60000] - The timeout time for the game.
	 * @param {string} [options.buttonStyle='PRIMARY'] - The style of the buttons for multiple mode.
	 * @param {string} [options.trueButtonStyle='SUCCESS'] - The style of the true button for single mode.
	 * @param {string} [options.falseButtonStyle='DANGER'] - The style of the false button for single mode.
	 * @param {string} [options.difficulty] - The difficulty of the trivia question. Can be 'easy', 'medium' or 'hard'.
	 * @param {string} [options.winMessage='You won! The correct answer is {answer}.'] - The win message for the game.
	 * @param {string} [options.loseMessage='You lost! The correct answer is {answer}.'] - The lose message for the game.
	 * @param {string} [options.errMessage='Unable to fetch question data! Please try again.'] - The error message for the game.
	 * @param {string} [options.playerOnlyMessage='Only {player} can use these buttons.'] - The message to show when someone else tries to use the buttons.
	 * @param {string} [options.categoryText] - The text to replace "Category:"
	 * @param {string} [options.difficultyText] - The text to replace "Difficulty:"
	 */
	constructor(options = {}) {
		if (!options.isSlashGame) options.isSlashGame = false
		if (!options.message) throw new TypeError("NO_MESSAGE: No message option was provided.")
		if (typeof options.message !== "object") throw new TypeError("INVALID_MESSAGE: message option must be an object.")
		if (typeof options.isSlashGame !== "boolean")
			throw new TypeError("INVALID_COMMAND_TYPE: isSlashGame option must be a boolean.")

		if (!options.embed) options.embed = {}
		if (!options.embed.title) options.embed.title = "Trivia"
		if (!options.embed.color) options.embed.color = "#551476"
		if (!options.embed.description) options.embed.description = "Your time to answer is going to end {timeoutTime}."

		if (!options.mode) options.mode = "multiple"
		if (!options.timeoutTime) options.timeoutTime = 60000
		if (!options.buttonStyle) options.buttonStyle = "PRIMARY"
		if (!options.trueButtonStyle) options.trueButtonStyle = "SUCCESS"
		if (!options.falseButtonStyle) options.falseButtonStyle = "DANGER"
		if (!options.difficulty) options.difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]

		if (!options.winMessage) options.winMessage = "You won! The correct answer is {answer}."
		if (!options.loseMessage) options.loseMessage = "You lost! The correct answer is {answer}."
		if (!options.errMessage) options.errMessage = "Unable to fetch question data! Please try again."
		if (!options.categoryText) options.categoryText = "Category"
		if (!options.difficultyText) options.difficultyText = "Difficulty"

		if (typeof options.embed !== "object") throw new TypeError("INVALID_EMBED: embed option must be an object.")
		if (typeof options.embed.title !== "string") throw new TypeError("INVALID_EMBED: embed title must be a string.")
		if (typeof options.embed.description !== "string")
			throw new TypeError("INVALID_EMBED: embed description must be a string.")
		if (typeof options.timeoutTime !== "number")
			throw new TypeError("INVALID_TIME: Timeout time option must be a number.")
		if (typeof options.difficulty !== "string")
			throw new TypeError("INVALID_DIFICULTY: Difficulty option must be a string.")
		if (typeof options.winMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Win message option must be a string.")
		if (typeof options.loseMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Lose message option must be a string.")
		if (typeof options.errMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Error message option must be a string.")
		if (typeof options.buttonStyle !== "string")
			throw new TypeError("INVALID_BUTTON_STYLE: button style must be a string.")
		if (typeof options.trueButtonStyle !== "string")
			throw new TypeError("INVALID_BUTTON_STYLE: button style must be a string.")
		if (typeof options.falseButtonStyle !== "string")
			throw new TypeError("INVALID_BUTTON_STYLE: button style must be a string.")
		if (!["multiple", "single"].includes(options.mode))
			throw new TypeError("INVALID_MODE: Mode option must be multiple or single.")
		if (!difficulties.includes(options.difficulty))
			throw new TypeError("INVALID_DIFFICULTY: Difficulty option must be a easy, medium or hard.")
		if (options.playerOnlyMessage !== false) {
			if (!options.playerOnlyMessage) options.playerOnlyMessage = "Only {player} can use these buttons."
			if (typeof options.playerOnlyMessage !== "string")
				throw new TypeError("INVALID_MESSAGE: playerOnly Message option must be a string.")
		}
		if (typeof options.categoryText !== "string")
			throw new TypeError("INVALID_MESSAGE: Category text option must be a string.")
		if (typeof options.difficultyText !== "string")
			throw new TypeError("INVALID_MESSAGE: Difficulty text option must be a string.")

		super()
		this.options = options
		this.message = options.message
		this.selected = null
		/**
		 * @typedef Trivia
		 * @type {Object}
		 * @property {string} question - The question of the trivia.
		 * @property {string} difficulty - The difficulty of the trivia.
		 * @property {string} category - The category of the trivia.
		 * @property {string} answer - The answer of the trivia.
		 * @property {string[]} options - The options of the trivia.
		 */
		/** @type {Trivia} */
		this.trivia = {}
	}

	async sendMessage(content) {
		if (this.options.isSlashGame) return await this.message.editReply(content)
		else return await this.message.channel.send(content)
	}

	async startGame() {
		if (this.options.isSlashGame || !this.message.author) {
			if (!this.message.deferred) await this.message.deferReply().catch((e) => {})
			this.message.author = this.message.user
			this.options.isSlashGame = true
		}

		await this.getTriviaQuestion()
		if (!this.trivia.question) return this.sendMessage({ content: this.options.errMessage })

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.trivia.question)
			.setDescription(
				this.options.embed.description.replace(
					"{timeoutTime}",
					`<t:${Math.floor((Date.now() + this.options.timeoutTime) / 1000)}:R>`
				)
			)
			.setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })
			.addFields({
				name: "\u200b",
				value: `**${this.options.difficultyText}:** ${this.trivia.difficulty}\n**${this.options.categoryText}:** ${this.trivia.category}`,
			})

		const msg = await this.sendMessage({ embeds: [embed], components: this.getComponents() })
		const collector = msg.createMessageComponentCollector({ idle: this.options.timeoutTime })

		collector.on("collect", async (btn) => {
			await btn.deferUpdate().catch((e) => {})
			if (btn.user.id !== this.message.author.id) {
				if (this.options.playerOnlyMessage)
					btn.followUp({ content: formatMessage(this.options, "playerOnlyMessage"), ephemeral: true })
				return
			}

			collector.stop()
			this.selected = btn.customId.split("_")[1]
			return this.gameOver(msg, this.trivia.options[this.selected - 1] === this.trivia.answer)
		})

		collector.on("end", async (_, reason) => {
			if (reason === "idle") return this.gameOver(msg, false)
		})
	}

	async gameOver(msg, result) {
		const TriviaGame = {
			player: this.message.author,
			question: this.trivia,
			selected: this.trivia.options[this.selected - 1] || this.selected,
		}
		const GameOverMessage = result ? this.options.winMessage : this.options.loseMessage
		this.emit("gameOver", { result: result ? "win" : "lose", ...TriviaGame })

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.trivia.question)
			.setDescription(this.trivia.answer)
			.setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })
			.addFields({
				name: "\u200b",
				value: `**${this.options.difficultyText}:** ${this.trivia.difficulty}\n**${this.options.categoryText}:** ${this.trivia.category}`,
			})

		return await msg.edit({
			content: GameOverMessage.replace("{answer}", this.trivia.answer),
			embeds: [embed],
			components: disableButtons(this.getComponents(true)),
		})
	}

	getComponents(gameOver) {
		const row = new ActionRowBuilder()

		if (this.options.mode === "multiple") {
			if (gameOver && !this.selected) this.selected = this.trivia.options.indexOf(this.trivia.answer) + 1
			const style = this.selected ? "SECONDARY" : this.options.buttonStyle
			const btn1 = new ButtonBuilder().setStyle(style).setCustomId("trivia_1").setLabel(this.trivia.options[0])
			const btn2 = new ButtonBuilder().setStyle(style).setCustomId("trivia_2").setLabel(this.trivia.options[1])
			const btn3 = new ButtonBuilder().setStyle(style).setCustomId("trivia_3").setLabel(this.trivia.options[2])
			const btn4 = new ButtonBuilder().setStyle(style).setCustomId("trivia_4").setLabel(this.trivia.options[3])
			row.addComponents(btn1, btn2, btn3, btn4)

			if (this.selected) {
				if (this.trivia.answer !== this.trivia.options[this.selected - 1])
					row.components[this.selected - 1].setStyle(this.options.falseButtonStyle)
				else row.components[this.selected - 1].setStyle(this.options.trueButtonStyle)
			}
		} else {
			if (gameOver && !this.selected) this.selected = this.trivia.answer
			const btn1 = new ButtonBuilder()
				.setStyle(this.selected ? "SECONDARY" : this.options.trueButtonStyle)
				.setCustomId("trivia_True")
				.setLabel("True")
			const btn2 = new ButtonBuilder()
				.setStyle(this.selected ? "SECONDARY" : this.options.falseButtonStyle)
				.setCustomId("trivia_False")
				.setLabel("False")
			row.addComponents(btn1, btn2)

			if (this.selected) {
				if (this.selected === "True") btn1.setStyle(this.selected === this.trivia.answer ? "SUCCESS" : "DANGER")
				else btn2.setStyle(this.selected === this.trivia.answer ? "SUCCESS" : "DANGER")
			}
		}

		return [row]
	}

	async getTriviaQuestion() {
		const questionMode = this.options.mode.replace("single", "boolean")
		const url = `https://opentdb.com/api.php?amount=1&type=${questionMode}&difficulty=${this.options.difficulty}`
		const result = await fetch(url)
			.then((res) => res.json())
			.then((res) => res.results[0])
			.catch((e) => {})
		if (!result) return false

		this.trivia = {
			question: decode(result.question),
			difficulty: decode(result.difficulty),
			category: decode(result.category),
			answer: decode(result.correct_answer),
			options: [],
		}

		if (questionMode === "multiple") {
			result.incorrect_answers.push(result.correct_answer)
			this.trivia.options = shuffleArray(result.incorrect_answers).map((e) => decode(e))
		}
	}
}

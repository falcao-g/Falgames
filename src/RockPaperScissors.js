import { EmbedBuilder, ActionRowBuilder } from "discord.js"
import { formatMessage, ButtonBuilder } from "../utils/utils.js"
import approve from "../utils/approve.js"

/**
 * This class allows you to create and manage a Rock Paper Scissors game in Discord, including handling user interactions and game logic.
 * It extends the `approve` class to handle the approval process for the second player (opponent).
 *
 * @class RockPaperScissors
 * @param {RockPaperScissorsOptions} options - The options for the Rock Paper Scissors game.
 *
 * @extends {events}
 * @fires RockPaperScissors#gameOver
 * @typedef {Object} RockPaperScissorsOptions
 */
export class RockPaperScissors extends approve {
	/**
	 * Represents a Rock Paper Scissors game.
	 * @constructor
	 * @param {Object} options - The options for the Rock Paper Scissors game.
	 * @param {boolean} [options.isSlashGame=false] - Whether the game is played using slash commands.
	 * @param {Object} options.message - The message object associated with the game.
	 * @param {Object} options.opponent - The opponent for the game.
	 * @param {Object} [options.embed] - The embed options for the game.
	 * @param {string} [options.embed.title='Rock Paper Scissors'] - The title of the embed.
	 * @param {string} [options.embed.color='#551476'] - The color of the embed.
	 * @param {string} [options.embed.description='Press a button below to make a choice.'] - The description of the embed.
	 * @param {Object} [options.buttons] - The button labels for the game.
	 * @param {string} [options.buttons.rock='Rock'] - The label for the rock button.
	 * @param {string} [options.buttons.paper='Paper'] - The label for the paper button.
	 * @param {string} [options.buttons.scissors='Scissors'] - The label for the scissors button.
	 * @param {Object} [options.emojis] - The emojis for the game.
	 * @param {string} [options.emojis.rock='🪨'] - The emoji for the rock button.
	 * @param {string} [options.emojis.paper='📄'] - The emoji for the paper button.
	 * @param {string} [options.emojis.scissors='✂️'] - The emoji for the scissors button.
	 * @param {number} [options.timeoutTime=60000] - The timeout time for the game.
	 * @param {string} [options.buttonStyle='PRIMARY'] - The style for the buttons.
	 * @param {string} [options.pickMessage='You choose {emoji}.'] - The message to show when a player picks a choice.
	 * @param {string} [options.winMessage='**{player}** won the Game! Congratulations!'] - The win message for the game.
	 * @param {string} [options.tieMessage='The Game tied! No one won the Game!'] - The tie message for the game.
	 * @param {string} [options.timeoutMessage='The Game went unfinished! No one won the Game!'] - The timeout message for the game.
	 * @param {string} [options.requestMessage='{opponent}, {player} has invited you for a round of **Rock Paper Scissors**.'] - The message to show when a player invites another player for a game.
	 * @param {string} [options.rejectMessage='The player denied your request for a round of **Rock Paper Scissors**.'] - The message to show when a player denies an invite for a game.
	 * @param {string} [options.playerOnlyMessage] - The message to show when someone else tries to use the buttons.
	 */
	constructor(options = {}) {
		if (!options.isSlashGame) options.isSlashGame = false
		if (!options.message) throw new TypeError("NO_MESSAGE: No message option was provided.")
		if (!options.opponent) throw new TypeError("NO_OPPONENT: No opponent option was provided.")
		if (typeof options.message !== "object") throw new TypeError("INVALID_MESSAGE: message option must be an object.")
		if (typeof options.isSlashGame !== "boolean")
			throw new TypeError("INVALID_COMMAND_TYPE: isSlashGame option must be a boolean.")
		if (typeof options.opponent !== "object")
			throw new TypeError("INVALID_OPPONENT: opponent option must be an object.")

		if (!options.embed) options.embed = {}
		if (!options.embed.title) options.embed.title = "Rock Paper Scissors"
		if (!options.embed.color) options.embed.color = "#551476"
		if (!options.embed.description) options.embed.description = "Press a button below to make a choice."

		if (!options.buttons) options.buttons = {}
		if (!options.buttons.rock) options.buttons.rock = "Rock"
		if (!options.buttons.paper) options.buttons.paper = "Paper"
		if (!options.buttons.scissors) options.buttons.scissors = "Scissors"

		if (!options.emojis) options.emojis = {}
		if (!options.emojis.rock) options.emojis.rock = "🪨"
		if (!options.emojis.paper) options.emojis.paper = "📄"
		if (!options.emojis.scissors) options.emojis.scissors = "✂️"

		if (!options.timeoutTime) options.timeoutTime = 60000
		if (!options.buttonStyle) options.buttonStyle = "PRIMARY"
		if (!options.pickMessage) options.pickMessage = "You choose {emoji}."
		if (!options.winMessage) options.winMessage = "**{player}** won the Game! Congratulations!"
		if (!options.tieMessage) options.tieMessage = "The Game tied! No one won the Game!"
		if (!options.timeoutMessage) options.timeoutMessage = "The Game went unfinished! No one won the Game!"
		if (!options.requestMessage)
			options.requestMessage = "{opponent}, {player} has invited you for a round of **Rock Paper Scissors**."
		if (!options.rejectMessage)
			options.rejectMessage = "The player denied your request for a round of **Rock Paper Scissors**."

		if (typeof options.embed !== "object") throw new TypeError("INVALID_EMBED: embed option must be an object.")
		if (typeof options.embed.title !== "string") throw new TypeError("INVALID_EMBED: embed title must be a string.")
		if (typeof options.embed.description !== "string")
			throw new TypeError("INVALID_EMBED: embed description must be a string.")
		if (typeof options.buttons !== "object") throw new TypeError("INVALID_BUTTONS: buttons option must be an object.")
		if (typeof options.buttons.rock !== "string") throw new TypeError("INVALID_BUTTONS: rock button must be a string.")
		if (typeof options.buttons.paper !== "string")
			throw new TypeError("INVALID_BUTTONS: paper button must be a string.")
		if (typeof options.buttons.scissors !== "string")
			throw new TypeError("INVALID_BUTTONS: scissors button must be a string.")
		if (typeof options.emojis !== "object") throw new TypeError("INVALID_EMOJIS: emojis option must be an object.")
		if (typeof options.emojis.rock !== "string") throw new TypeError("INVALID_EMOJIS: rock emoji must be a string.")
		if (typeof options.emojis.paper !== "string") throw new TypeError("INVALID_EMOJIS: paper emoji must be a string.")
		if (typeof options.emojis.scissors !== "string")
			throw new TypeError("INVALID_EMOJIS: scissors emoji must be a string.")
		if (typeof options.timeoutTime !== "number")
			throw new TypeError("INVALID_TIME: Timeout time option must be a number.")
		if (typeof options.buttonStyle !== "string")
			throw new TypeError("INVALID_BUTTON_STYLE: button style must be a string.")
		if (typeof options.pickMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Pick message option must be a string.")
		if (typeof options.winMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Win message option must be a string.")
		if (typeof options.tieMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Tie message option must be a string.")
		if (typeof options.timeoutMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Timeout message option must be a string.")
		if (typeof options.requestMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Request message option must be a string.")
		if (typeof options.rejectMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Reject message option must be a string.")
		if (options.playerOnlyMessage !== false) {
			if (!options.playerOnlyMessage) options.playerOnlyMessage = "Only {player} and {opponent} can use these buttons."
			if (typeof options.playerOnlyMessage !== "string")
				throw new TypeError("INVALID_MESSAGE: playerOnly Message option must be a string.")
		}

		super(options)
		this.options = options
		this.message = options.message
		this.opponent = options.opponent
		this.playerPick = null
		this.opponentPick = null
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

		const approve = await this.approve()
		if (approve) this.RPSGame(approve)
	}

	async RPSGame(msg) {
		const emojis = this.options.emojis
		const labels = this.options.buttons
		const choice = { r: emojis.rock, p: emojis.paper, s: emojis.scissors }

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setDescription(this.options.embed.description)
			.setFooter({ text: this.message.author.tag + " vs " + this.opponent.tag })

		const r = new ButtonBuilder()
			.setStyle(this.options.buttonStyle)
			.setEmoji(choice.r)
			.setCustomId("rps_r")
			.setLabel(labels.rock)
		const p = new ButtonBuilder()
			.setStyle(this.options.buttonStyle)
			.setEmoji(choice.p)
			.setCustomId("rps_p")
			.setLabel(labels.paper)
		const s = new ButtonBuilder()
			.setStyle(this.options.buttonStyle)
			.setEmoji(choice.s)
			.setCustomId("rps_s")
			.setLabel(labels.scissors)
		const row = new ActionRowBuilder().addComponents(r, p, s)

		await msg.edit({ content: null, embeds: [embed], components: [row] })
		const collector = msg.createMessageComponentCollector({ idle: this.options.timeoutTime })

		collector.on("collect", async (btn) => {
			await btn.deferUpdate().catch((e) => {})
			if (btn.user.id !== this.message.author.id && btn.user.id !== this.opponent.id) {
				if (this.options.playerOnlyMessage)
					btn.followUp({ content: formatMessage(this.options, "playerOnlyMessage"), ephemeral: true })
				return
			}

			if (btn.user.id === this.message.author.id && !this.playerPick) {
				this.playerPick = choice[btn.customId.split("_")[1]]
				btn.followUp({ content: this.options.pickMessage.replace("{emoji}", this.playerPick), ephemeral: true })
			} else if (!this.opponentPick) {
				this.opponentPick = choice[btn.customId.split("_")[1]]
				btn.followUp({ content: this.options.pickMessage.replace("{emoji}", this.opponentPick), ephemeral: true })
			}
			if (this.playerPick && this.opponentPick) return collector.stop()
		})

		collector.on("end", async (_, reason) => {
			if (reason === "idle" || reason === "user") return this.gameOver(msg, this.getResult())
		})
	}

	getResult() {
		if (!this.playerPick && !this.opponentPick) return "timeout"
		else if (this.playerPick === this.opponentPick) return "tie"
		else return "win"
	}

	player1Won() {
		const { rock: r, paper: p, scissors: s } = this.options.emojis
		return (
			(this.playerPick === s && this.opponentPick === p) ||
			(this.playerPick === r && this.opponentPick === s) ||
			(this.playerPick === p && this.opponentPick === r)
		)
	}

	async gameOver(msg, result) {
		const RPSGame = {
			player: this.message.author,
			opponent: this.opponent,
			playerPick: this.playerPick,
			opponentPick: this.opponentPick,
		}
		if (result === "win") RPSGame.winner = this.player1Won() ? this.message.author.id : this.opponent.id
		this.emit("gameOver", { result, ...RPSGame })
		this.player1Turn = this.player1Won()

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setFooter({ text: this.message.author.tag + " vs " + this.opponent.tag })
			.setDescription(this.formatTurnMessage(this.options, result + "Message"))
			.addFields({ name: this.message.author.username, value: this.playerPick ?? "❔", inline: true })
			.addFields({ name: "VS", value: "⚡", inline: true })
			.addFields({ name: this.opponent.username, value: this.opponentPick ?? "❔", inline: true })

		return msg.edit({ embeds: [embed], components: [] })
	}
}

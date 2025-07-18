import { EmbedBuilder, ActionRowBuilder } from "discord.js"
import { disableButtons, formatMessage, ButtonBuilder } from "../utils/utils.js"
import approve from "../utils/approve.js"

/**
 * This class allows you to create and manage a Tic Tac Toe game in Discord, including handling user interactions and game logic.
 * It extends the `approve` class to handle the approval process for the second player (opponent).
 *
 * @class TicTacToe
 * @param {TicTacToeOptions} options - The options for the Tic Tac Toe game.
 *
 * @extends {events}
 * @fires TicTacToe#gameOver
 * @typedef {Object} TicTacToeOptions
 */
export class TicTacToe extends approve {
	/**
	 * Represents a TicTacToe game.
	 * @constructor
	 * @param {Object} options - The options for the TicTacToe game.
	 * @param {boolean} [options.isSlashGame=false] - Whether the game is played using slash commands.
	 * @param {Object} options.message - The message object associated with the game.
	 * @param {Object} options.opponent - The opponent object for the game.
	 * @param {Object} [options.embed={}] - The embed options for the game.
	 * @param {string} [options.embed.title='Tic Tac Toe'] - The title of the embed.
	 * @param {string} [options.embed.statusTitle='Status'] - The status title of the embed.
	 * @param {string} [options.embed.overTitle='Game Over'] - The game over title of the embed.
	 * @param {string} [options.embed.color='#551476'] - The color of the embed.
	 * @param {Object} [options.emojis={}] - The emojis for the game.
	 * @param {string} [options.emojis.xButton='❌'] - The emoji for the X button.
	 * @param {string} [options.emojis.oButton='🔵'] - The emoji for the O button.
	 * @param {string} [options.emojis.blankButton='➖'] - The emoji for the blank button.
	 * @param {number} [options.timeoutTime=60000] - The timeout time for the game.
	 * @param {string} [options.xButtonStyle='DANGER'] - The style for the X button.
	 * @param {string} [options.oButtonStyle='PRIMARY'] - The style for the O button.
	 * @param {string} [options.turnMessage='{emoji} | Its turn of player **{player}**.'] - The turn message for the game.
	 * @param {string} [options.winMessage='{emoji} | **{player}** won the TicTacToe Game.'] - The win message for the game.
	 * @param {string} [options.tieMessage='The Game tied! No one won the Game!'] - The tie message for the game.
	 * @param {string} [options.timeoutMessage='The Game went unfinished! No one won the Game!'] - The timeout message for the game.
	 * @param {string} [options.requestMessage='{player} has invited you for a round of **Tic Tac Toe**.'] - The request message for the game.
	 * @param {string} [options.rejectMessage='The player denied your request for a round of **Tic Tac Toe**.'] - The reject message for the game.
	 * @param {string} [options.playerOnlyMessage='Only {player} and {opponent} can use these buttons.'] - The message to show when someone else tries to use the buttons.
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
		if (!options.embed.title) options.embed.title = "Tic Tac Toe"
		if (!options.embed.statusTitle) options.embed.statusTitle = "Status"
		if (!options.embed.overTitle) options.embed.overTitle = "Game Over"
		if (!options.embed.color) options.embed.color = "#551476"

		if (!options.emojis) options.emojis = {}
		if (!options.emojis.xButton) options.emojis.xButton = "❌"
		if (!options.emojis.oButton) options.emojis.oButton = "🔵"
		if (!options.emojis.blankButton) options.emojis.blankButton = "➖"

		if (!options.timeoutTime) options.timeoutTime = 60000
		if (!options.xButtonStyle) options.xButtonStyle = "DANGER"
		if (!options.oButtonStyle) options.oButtonStyle = "PRIMARY"
		if (!options.turnMessage) options.turnMessage = "{emoji} | Its turn of player **{player}**."
		if (!options.winMessage) options.winMessage = "{emoji} | **{player}** won the TicTacToe Game."
		if (!options.tieMessage) options.tieMessage = "The Game tied! No one won the Game!"
		if (!options.timeoutMessage) options.timeoutMessage = "The Game went unfinished! No one won the Game!"
		if (!options.requestMessage) options.requestMessage = "{player} has invited you for a round of **Tic Tac Toe**."
		if (!options.rejectMessage) options.rejectMessage = "The player denied your request for a round of **Tic Tac Toe**."

		if (typeof options.embed !== "object") throw new TypeError("INVALID_EMBED: embed option must be an object.")
		if (typeof options.embed.title !== "string") throw new TypeError("INVALID_EMBED: embed title must be a string.")
		if (typeof options.embed.statusTitle !== "string")
			throw new TypeError("INVALID_EMBED: status title must be a string.")
		if (typeof options.embed.overTitle !== "string") throw new TypeError("INVALID_EMBED: over title must be a string.")
		if (typeof options.emojis !== "object") throw new TypeError("INVALID_EMOJIS: emojis option must be an object.")
		if (typeof options.emojis.xButton !== "string")
			throw new TypeError("INVALID_EMOJIS: xButton emoji must be a string.")
		if (typeof options.emojis.oButton !== "string")
			throw new TypeError("INVALID_EMOJIS: oButton emoji must be a string.")
		if (typeof options.emojis.blankButton !== "string")
			throw new TypeError("INVALID_EMOJIS: blankButton emoji must be a string.")
		if (typeof options.xButtonStyle !== "string")
			throw new TypeError("INVALID_BUTTON_STYLE: xbutton style must be a string.")
		if (typeof options.oButtonStyle !== "string")
			throw new TypeError("INVALID_BUTTON_STYLE: obutton style must be a string.")
		if (typeof options.turnMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Turn message option must be a string.")
		if (typeof options.winMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Win message option must be a string.")
		if (typeof options.tieMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Tie message option must be a string.")
		if (typeof options.timeoutMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Win message option must be a string.")
		if (typeof options.timeoutTime !== "number") throw new TypeError("INVALID_TIME: time option must be a number.")
		if (options.playerOnlyMessage !== false) {
			if (!options.playerOnlyMessage) options.playerOnlyMessage = "Only {player} and {opponent} can use these buttons."
			if (typeof options.playerOnlyMessage !== "string")
				throw new TypeError("INVALID_MESSAGE: playerOnly Message option must be a string.")
		}

		super(options)
		this.options = options
		this.message = options.message
		this.opponent = options.opponent
		this.gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]
		this.player1Turn = true
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
		if (approve) this.TicTacToeGame(approve)
	}

	async TicTacToeGame(msg) {
		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setFooter({ text: this.message.author.tag + " vs " + this.opponent.tag })
			.addFields({ name: this.options.embed.statusTitle, value: this.getTurnMessage() })

		await msg.edit({ content: null, embeds: [embed], components: this.getComponents() })
		this.handleButtons(msg)
	}

	handleButtons(msg) {
		const collector = msg.createMessageComponentCollector({ idle: this.options.timeoutTime })

		collector.on("collect", async (btn) => {
			await btn.deferUpdate().catch((e) => {})
			if (btn.user.id !== this.message.author.id && btn.user.id !== this.opponent.id) {
				if (this.options.playerOnlyMessage)
					btn.followUp({ content: formatMessage(this.options, "playerOnlyMessage"), ephemeral: true })
				return
			}

			if (btn.user.id !== (this.player1Turn ? this.message.author : this.opponent).id) return
			this.gameBoard[btn.customId.split("_")[1]] = this.player1Turn ? 1 : 2
			if (this.hasWonGame(1) || this.hasWonGame(2) || !this.gameBoard.includes(0)) collector.stop()
			if (this.hasWonGame(1) || this.hasWonGame(2)) return this.gameOver(msg, "win")
			if (!this.gameBoard.includes(0)) return this.gameOver(msg, "tie")
			this.player1Turn = !this.player1Turn

			const embed = new EmbedBuilder()
				.setColor(this.options.embed.color)
				.setTitle(this.options.embed.title)
				.setFooter({ text: this.message.author.tag + " vs " + this.opponent.tag })
				.addFields({ name: this.options.embed.statusTitle, value: this.getTurnMessage() })

			return await msg.edit({ embeds: [embed], components: this.getComponents() })
		})

		collector.on("end", async (_, reason) => {
			if (reason === "idle") return this.gameOver(msg, "timeout")
		})
	}

	async gameOver(msg, result) {
		const TicTacToeGame = { player: this.message.author, opponent: this.opponent, gameBoard: this.gameBoard }
		if (result === "win") TicTacToeGame.winner = this.hasWonGame(1) ? this.message.author.id : this.opponent.id
		this.emit("gameOver", { result: result, ...TicTacToeGame })

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setFooter({ text: this.message.author.tag + " vs " + this.opponent.tag })
			.addFields({ name: this.options.embed.overTitle, value: this.getTurnMessage(result + "Message") })

		return await msg.edit({ embeds: [embed], components: disableButtons(this.getComponents()) })
	}

	isGameOver() {
		if (this.hasWonGame(1) || this.hasWonGame(2) || !this.gameBoard.includes(0)) return true
		return false
	}

	hasWonGame(player) {
		if (
			this.gameBoard[0] === this.gameBoard[4] &&
			this.gameBoard[0] === this.gameBoard[8] &&
			this.gameBoard[0] === player
		) {
			return true
		} else if (
			this.gameBoard[6] === this.gameBoard[4] &&
			this.gameBoard[6] === this.gameBoard[2] &&
			this.gameBoard[6] === player
		) {
			return true
		}
		for (let i = 0; i < 3; ++i) {
			if (
				this.gameBoard[i * 3] === this.gameBoard[i * 3 + 1] &&
				this.gameBoard[i * 3] === this.gameBoard[i * 3 + 2] &&
				this.gameBoard[i * 3] === player
			) {
				return true
			}
			if (
				this.gameBoard[i] === this.gameBoard[i + 3] &&
				this.gameBoard[i] === this.gameBoard[i + 6] &&
				this.gameBoard[i] === player
			) {
				return true
			}
		}
		return false
	}

	getPlayerEmoji() {
		return this.player1Turn ? this.options.emojis.xButton : this.options.emojis.oButton
	}

	getTurnMessage(msg) {
		return this.formatTurnMessage(this.options, msg ?? "turnMessage").replace("{emoji}", this.getPlayerEmoji())
	}

	getButton(btn) {
		if (btn === 1) return { emoji: this.options.emojis.xButton, style: this.options.xButtonStyle }
		else if (btn === 2) return { emoji: this.options.emojis.oButton, style: this.options.oButtonStyle }
		else return { emoji: this.options.emojis.blankButton, style: "SECONDARY" }
	}

	getComponents() {
		const components = []

		for (let x = 0; x < 3; x++) {
			const row = new ActionRowBuilder()
			for (let y = 0; y < 3; y++) {
				const button = this.getButton(this.gameBoard[y * 3 + x])
				const btn = new ButtonBuilder()
					.setEmoji(button.emoji)
					.setStyle(button.style)
					.setCustomId("TicTacToe_" + (y * 3 + x))
				if (this.gameBoard[y * 3 + x] !== 0) btn.setDisabled(true)
				row.addComponents(btn)
			}
			components.push(row)
		}
		return components
	}
}

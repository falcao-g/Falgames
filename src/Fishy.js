import { EmbedBuilder } from "discord.js"
import events from "node:events"

export class Fishy extends events {
	/**
	 * Represents a Fishy game.
	 * @constructor
	 * @param {Object} options - The options for the Fishy game.
	 * @param {boolean} [options.isSlashGame=false] - Whether the game is played using slash commands.
	 * @param {Object} options.message - The message object associated with the game.
	 * @param {Object} [options.embed={}] - The embed options for the game.
	 * @param {string} [options.embed.title='Fishy Inventory'] - The title of the embed.
	 * @param {string} [options.embed.color='#551476'] - The color of the embed.
	 * @param {Object} [options.player={}] - The player options for the game.
	 * @param {string} [options.player.id] - The ID of the player.
	 * @param {number} [options.player.balance=50] - The balance of the player.
	 * @param {Object} [options.player.fishes={}] - The fishes owned by the player.
	 * @param {Object} [options.fishes={}] - The available fishes in the game.
	 * @param {Object} [options.fishes.junk] - The options for the junk fish.
	 * @param {string} [options.fishes.junk.emoji='🔧'] - The emoji representation of the junk fish.
	 * @param {number} [options.fishes.junk.price=5] - The price of the junk fish.
	 * @param {Object} [options.fishes.common] - The options for the common fish.
	 * @param {string} [options.fishes.common.emoji='🐟'] - The emoji representation of the common fish.
	 * @param {number} [options.fishes.common.price=10] - The price of the common fish.
	 * @param {Object} [options.fishes.uncommon] - The options for the uncommon fish.
	 * @param {string} [options.fishes.uncommon.emoji='🐠'] - The emoji representation of the uncommon fish.
	 * @param {number} [options.fishes.uncommon.price=20] - The price of the uncommon fish.
	 * @param {Object} [options.fishes.rare] - The options for the rare fish.
	 * @param {string} [options.fishes.rare.emoji='🐡'] - The emoji representation of the rare fish.
	 * @param {number} [options.fishes.rare.price=50] - The price of the rare fish.
	 * @param {number} [options.fishyRodPrice=10] - The price of the fishing rod.
	 * @param {string} [options.catchMessage='You caught a {fish}. You paid {amount} for the fishing rod.'] - The message displayed when a fish is caught.
	 * @param {string} [options.sellMessage='You sold {amount}x {fish} {type} items for a total of {price}.'] - The message displayed when fish is sold.
	 * @param {string} [options.noBalanceMessage='You don\'t have enough balance to rent a fishing rod.'] - The message displayed when the player doesn't have enough balance.
	 * @param {string} [options.invalidTypeMessage='Fish type can only be junk, common, uncommon or rare.'] - The message displayed when an invalid fish type is provided.
	 * @param {string} [options.invalidAmountMessage='Amount must be between 0 and fish max amount.'] - The message displayed when an invalid amount is provided.
	 * @param {string} [options.noItemMessage='You don\'t have any of this item in your inventory.'] - The message displayed when the player doesn't have the requested item.
	 */
	constructor(options = {}) {
		if (!options.isSlashGame) options.isSlashGame = false
		if (!options.message) throw new TypeError("NO_MESSAGE: No message option was provided.")
		if (typeof options.message !== "object") throw new TypeError("INVALID_MESSAGE: message option must be an object.")
		if (typeof options.isSlashGame !== "boolean")
			throw new TypeError("INVALID_COMMAND_TYPE: isSlashGame option must be a boolean.")

		if (!options.embed) options.embed = {}
		if (!options.embed.title) options.embed.title = "Fishy Inventory"
		if (!options.embed.color) options.embed.color = "#551476"

		if (!options.player) options.player = {}
		if (!options.player.id) options.player.id = options.message[options.isSlashGame ? "user" : "author"].id
		if (!options.player.balance && options.player.balance !== 0) options.player.balance = 50
		if (!options.player.fishes) options.player.fishes = {}

		if (!options.fishes) options.fishes = {}
		if (!options.fishes.junk) options.fishes.junk = { emoji: "🔧", price: 5 }
		if (!options.fishes.common) options.fishes.common = { emoji: "🐟", price: 10 }
		if (!options.fishes.uncommon) options.fishes.uncommon = { emoji: "🐠", price: 20 }
		if (!options.fishes.rare) options.fishes.rare = { emoji: "🐡", price: 50 }

		if (!options.fishyRodPrice) options.fishyRodPrice = 10
		if (!options.catchMessage) options.catchMessage = "You caught a {fish}. You paid {amount} for the fishing rod."
		if (!options.sellMessage) options.sellMessage = "You sold {amount}x {fish} {type} items for a total of {price}."
		if (!options.noBalanceMessage) options.noBalanceMessage = "You don't have enough balance to rent a fishing rod."
		if (!options.invalidTypeMessage)
			options.invalidTypeMessage = "Fish type can only be junk, common, uncommon or rare."
		if (!options.invalidAmountMessage) options.invalidAmountMessage = "Amount must be between 0 and fish max amount."
		if (!options.noItemMessage) options.noItemMessage = "You don't have any of this item in your inventory."

		if (typeof options.embed !== "object") throw new TypeError("INVALID_EMBED: embed option must be an object.")
		if (typeof options.embed.title !== "string") throw new TypeError("INVALID_EMBED: embed title must be a string.")
		if (typeof options.player !== "object") throw new TypeError("INVALID_PLAYER: player option must be an object.")
		if (typeof options.player.id !== "string") throw new TypeError("INVALID_PLAYER: player id must be a string.")
		if (typeof options.player.fishes !== "object")
			throw new TypeError("INVALID_PLAYER: player fishes must be an object.")
		if (typeof options.player.balance !== "number")
			throw new TypeError("INVALID_PLAYER: player money must be a number.")
		if (typeof options.fishyRodPrice !== "number")
			throw new TypeError("INVALID_PRICE: FishyRod Price must be a number.")
		if (typeof options.catchMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Catch message option must be a string.")
		if (typeof options.sellMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: Sell message option must be a string.")
		if (typeof options.noBalanceMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: noBalance message option must be a string.")
		if (typeof options.invalidTypeMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: InvalidType message option must be a string.")
		if (typeof options.invalidAmountMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: InvalidAmount message option must be a string.")
		if (typeof options.noItemMessage !== "string")
			throw new TypeError("INVALID_MESSAGE: noItem message option must be a string.")
		if (!options.message.deferred && options.isSlashGame) options.message.deferReply().catch((e) => {})

		super()
		this.options = options
		this.message = options.message
		this.player = options.player
		this.fishes = options.fishes
	}

	async sendMessage(content) {
		if (this.options.isSlashGame) {
			if (!this.message.deferred) return await this.message.reply(content)
			else return await this.message.editReply(content)
		} else return await this.message.channel.send(content)
	}

	async catchFish() {
		let fishType = "rare"
		const fishId = Math.floor(Math.random() * 10) + 1

		if (fishId < 5) fishType = "junk"
		else if (fishId < 8) fishType = "common"
		else if (fishId < 10) fishType = "uncommon"

		const fish = this.fishes[fishType]
		if (this.player.balance < this.options.fishyRodPrice)
			return this.sendMessage({ content: this.options.noBalanceMessage })
		const content = this.options.catchMessage
			.replace("{fish}", fish.emoji)
			.replace("{amount}", this.options.fishyRodPrice)

		this.player.balance -= this.options.fishyRodPrice
		this.player.fishes[fishType] = (this.player.fishes[fishType] || 0) + 1

		this.emit("catchFish", { player: this.player, fishType: fishType, fish: fish })
		return await this.sendMessage({ content: content })
	}

	async sellFish(type, amount) {
		if (!this.fishes[type]) return this.sendMessage({ content: this.options.invalidTypeMessage })
		if (!this.player.fishes[type]) return this.sendMessage({ content: this.options.noItemMessage })
		if (parseInt(amount) < 0 || parseInt(amount) > this.player.fishes[type])
			return this.sendMessage({ content: this.options.invalidAmountMessage })

		const fish = this.fishes[type]
		const content = this.options.sellMessage
			.replace("{amount}", amount)
			.replace("{type}", type)
			.replace("{fish}", fish.emoji)
			.replace("{price}", fish.price * amount)

		this.player.fishes[type] -= amount
		this.player.balance += fish.price * amount

		this.emit("sellFish", { player: this.player, fishType: type, fish: fish })
		return await this.sendMessage({ content: content })
	}

	async fishyInventory() {
		const fishes = ["Common", "Uncommon", "Rare"]
			.map(
				(e) => `**\u2000${this.fishes[e.toLowerCase()].emoji} ${e} Fish** — ${this.player.fishes[e.toLowerCase()] || 0}`
			)
			.join("\n\n")

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })
			.setDescription(fishes + `\n\n\u2000**${this.fishes.junk.emoji} Junk** — ${this.player.fishes.junk || 0}`)
			.setTimestamp()

		return await this.sendMessage({ embeds: [embed] })
	}
}

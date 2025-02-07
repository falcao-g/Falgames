import { EmbedBuilder, Message, ColorResolvable, CommandInteraction } from "npm:discord.js@14.17.3";

export class Roll extends EventTarget {
  private options: {
    isSlashGame: boolean;
    message: Message;
    interaction: CommandInteraction;
    embed: { title: string; color: string };
    notValidRollMessage: string;
    rollLimit: number;
    rollLimitMessage: string;
  };

  constructor(options: {
    isSlashGame?: boolean;
    message: Message;
    interaction: CommandInteraction;
    embed?: { title?: string; color?: string };
    notValidRollMessage?: string;
    rollLimit?: number;
    rollLimitMessage?: string;
  }) {
    super();

    if (!options.message) throw new TypeError("NO_MESSAGE: No message provided.");

    this.options = {
      isSlashGame: options.isSlashGame ?? false,
      message: options.message,
      interaction: options.interaction,
      embed: {
        title: options.embed?.title ?? "Dice Roll",
        color: options.embed?.color ?? "#551476",
      },
      notValidRollMessage: options.notValidRollMessage ?? "Please provide a valid roll.",
      rollLimit: options.rollLimit ?? 500,
      rollLimitMessage: options.rollLimitMessage ?? "You can't roll this many dice.",
    };
  }

  private async sendMessage(content: string | { embeds: EmbedBuilder[] }) {
    if (this.options.isSlashGame) {
      return await this.options.interaction.editReply(content);
    } else {
      if ('send' in this.options.message.channel) {
        return await this.options.message.channel.send(content);
      } else {
        throw new Error("The channel does not support sending messages.");
      }
    }
  }

  async roll(expression: string) {
    try {
      const result = this.calculate(expression);

      if (result.length > this.options.rollLimit) {
        await this.sendMessage(this.options.rollLimitMessage);
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(this.options.embed.color as ColorResolvable)
        .setTitle(this.options.embed.title)
        .setDescription(result)
        .setFooter({
          text: this.options.message.author.username,
          iconURL: this.options.message.author.displayAvatarURL(),
        });

      await this.sendMessage({ embeds: [embed] });
    } catch {
      await this.sendMessage(this.options.notValidRollMessage);
    }
  }

  private randint(low: number, high: number): number {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return low + (buffer[0] % (high - low + 1));
  }

  private calculate(expressionRaw: string): string {
    let expression = "";
    for (let i = 0; i < expressionRaw.length; i++) {
      if (["+", "-"].includes(expressionRaw[i]) && expressionRaw[i - 1] !== " ") {
        expression += ` ${expressionRaw[i]} `;
      } else {
        expression += expressionRaw[i];
      }
    }

    const parts = expression.split(" ");
    let result = "";
    let total = 0;
    let add = true;

    for (const part of parts) {
      if (part.startsWith("d")) {
        parts[parts.indexOf(part)] = "1" + part;
      }

      if (part === "+") {
        add = true;
        result += " + ";
        continue;
      } else if (part === "-") {
        add = false;
        result += " - ";
        continue;
      }

      const diceMatch = part.match(/^(\d+)d(\d+)$/);
      const numberMatch = part.match(/^\d+$/);

      if (diceMatch) {
        const count = parseInt(diceMatch[1]);
        const sides = parseInt(diceMatch[2]);
        const rolls: number[] = [];

        for (let j = 0; j < count; j++) {
          const roll = this.randint(1, sides);
          rolls.push(roll);
          total += add ? roll : -roll;
        }

        result += `${part} (${rolls.map(r => (r === 1 || r === sides ? `**${r}**` : r)).join(", ")})`;
      } else if (numberMatch) {
        const value = parseInt(part);
        result += value;
        total += add ? value : -value;
      } else {
        throw new Error(`Invalid expression: ${part}`);
      }
    }

    result += ` = \`${total}\``;
    return result;
  }
}

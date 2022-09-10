const TicTacToe = require("discord-tictactoe")
const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
import { ApplicationCommandOptionType } from "discord.js";
const game = new TicTacToe({language: 'en'})

export default commandModule({
	name: 'tictactoe',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'tres en raya',
	//alias : [],
	options: [
		{
			name: "opponent",
			description: "opponent",
			type: ApplicationCommandOptionType.User
		}
	],
	execute: async (ctx, options) => {
		await game.handleInteraction(ctx.interaction)
	},
});
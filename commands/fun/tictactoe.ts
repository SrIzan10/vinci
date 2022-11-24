import TicTacToe from 'discord-tictactoe';
import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import { ApplicationCommandOptionType } from "discord.js";
const game = new TicTacToe({language: 'en'})

export default commandModule({
	name: 'tictactoe',
    type: CommandType.Slash,
	plugins: [publish()],
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
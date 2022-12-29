import TicTacToe from 'discord-tictactoe';
import { commandModule, CommandType } from '@sern/handler'
import { publish } from "#plugins";
import { ownerOnly } from "#plugins";
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
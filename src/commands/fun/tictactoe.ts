import TicTacToe from 'discord-tictactoe';
import { commandModule, CommandType } from '@sern/handler'

import { ApplicationCommandOptionType } from "discord.js";
const game = new TicTacToe({language: 'en'})

export default commandModule({
	name: 'tictactoe',
    type: CommandType.Slash,
	plugins: [],
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
		ctx.reply({ content: 'comando desactivado temporalmente :(', ephemeral: true })
		// game.handleInteraction(ctx.interaction as ChatInputCommandInteraction)
	},
});
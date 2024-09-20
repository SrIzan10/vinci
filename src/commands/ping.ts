import { commandModule, CommandType } from '@sern/handler'

import { ownerOnly } from "#plugins"

export default commandModule({
	name: 'ping',
    type: CommandType.Slash,
	plugins: [],
	description: 'A ping command',
	//alias : [],
	options: [],
	execute: async (ctx, options) => {
		await ctx.reply('Hello World!');
	},
});
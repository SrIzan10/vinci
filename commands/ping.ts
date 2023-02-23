import { commandModule, CommandType } from '@sern/handler'
import { publish } from "#plugins";
import { ownerOnly } from "#plugins"

export default commandModule({
	name: 'ping',
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'A ping command',
	//alias : [],
	options: [],
	execute: async (ctx, options) => {
		await ctx.reply('Hello World!');
	},
});
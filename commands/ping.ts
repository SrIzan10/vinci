import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../plugins/publish.js";
import { ownerOnly } from "../plugins/ownerOnly.js"
/*
import { publish } from "#plugins";
import { ownerOnly } from "#plugins"
*/

export default commandModule({
	name: 'ping',
    type: CommandType.Slash,
	plugins: [publish()],
	// , '928018226330337280'
	description: 'A ping command',
	//alias : [],
	options: [],
	execute: async (ctx, options) => {
		await ctx.reply('Hello World!');
	},
});
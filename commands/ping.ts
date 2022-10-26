import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../src/plugins/publish.js";
import { ownerOnly } from "../src/plugins/ownerOnly.js"
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: 'ping',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298'] })],
	// , '928018226330337280'
	description: 'A ping command',
	//alias : [],
	options: [],
	execute: async (ctx, options) => {
		await ctx.reply('Hello World!');
	},
});
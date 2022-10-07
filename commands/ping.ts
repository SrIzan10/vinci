const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../src/plugins/publish";
import { ownerOnly } from "../src/plugins/ownerOnly"
/*
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
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
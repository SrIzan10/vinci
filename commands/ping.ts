const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../src/plugins/publish";
import { ownerOnly } from "../src/plugins/ownerOnly"
/*
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
*/

export default commandModule({
	name: 'ping',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298'])],
	// 928018226330337280
	description: 'A ping command',
	//alias : [],
	execute: async (ctx, args) => {
		await ctx.reply('Hello World!');
	},
});
const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../src/plugins/publish";
const attachment1 = 'A.png';

export default commandModule({
	name: 'a',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280'])],
	description: 'A',
	//alias : [],
	execute: async (ctx, args) => {
		await ctx.reply({content: '<@918154803870306354>', files: [attachment1]});
	},
});
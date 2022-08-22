const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
const attachment1 = 'A.png';

export default commandModule({
	name: 'a',
    type: CommandType.Both,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'], dmPermission: false, defaultMemberPermissions: 0n })],
	description: 'A',
	//alias : [],
	execute: async (ctx, args) => {
		await ctx.reply({content: 'A', files: [attachment1]});
	},
});
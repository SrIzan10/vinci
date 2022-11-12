import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../../src/plugins/publish_contextmenu.js';
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: 'cursivify',
	type: CommandType.MenuMsg,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	execute: async (ctx) => {
		await ctx.deferReply()
		const trimmedstring = ctx.targetMessage.content.replaceAll('*', '');
		if (trimmedstring.length === 0) {
			await ctx.editReply('No hay nada que cursivificar!');
		} else {
			await ctx.editReply(`*${trimmedstring}*`);
		}
	},
});

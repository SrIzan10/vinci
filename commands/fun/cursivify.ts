import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../../plugins/publish.js';
/*
import { publish } from "#plugins";
import { ownerOnly } from "#plugins"
*/

export default commandModule({
	name: 'cursivify',
	type: CommandType.CtxMsg,
	plugins: [publish()],
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

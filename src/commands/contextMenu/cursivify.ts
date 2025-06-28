import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
	name: 'cursivify',
	type: CommandType.CtxMsg,
	plugins: [],
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

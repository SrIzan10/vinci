import { commandModule, CommandType } from '@sern/handler'
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: 'cursivify',
    type: CommandType.Text,
	plugins: [],
	// , '928018226330337280'
	description: 'Haz un mensaje en *cursiva*',
	alias : ['cu'],
	execute: async (ctx, options) => {
		try {
			const repliedmessage = await ctx.message.channel.messages.fetch(ctx.message.reference!.messageId!);
			const trimmedstring = repliedmessage.content.replaceAll('*', '')
			if (trimmedstring.length === 0) {
				await ctx.reply('No hay nada que cursivificar!')
			} else {
				await ctx.reply(`*${trimmedstring}*`)
			}
			
		} catch (err) {
			await ctx.reply('Asegúrate que estás respondiendo al mensaje que quieras hacer cursiva!')
		}
		
	},
});
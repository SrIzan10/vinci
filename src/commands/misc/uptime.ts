import { commandModule, CommandType } from '@sern/handler'
// @ts-ignore
import prettySeconds from 'pretty-seconds-spanish'

export default commandModule({
	name: 'uptime',
    type: CommandType.Slash,
	plugins: [],
	description: 'Enseña el tiempo que ha estado encendido el bot.',
	//alias : [],
	options: [],
	execute: async (ctx) => {
		// const uptime = prettyMilliseconds(ctx.client.uptime!)
		const uptime = prettySeconds(process.uptime())
		await ctx.reply(`El bot lleva encendido ${uptime}`);
	},
});
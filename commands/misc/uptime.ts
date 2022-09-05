const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
const prettySeconds = require('pretty-seconds-spanish')

export default commandModule({
	name: 'uptime',
    type: CommandType.Both,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'Enseña el tiempo que ha estado encendido el bot.',
	//alias : [],
	options: [],
	execute: async (ctx, options) => {
		// const uptime = prettyMilliseconds(ctx.client.uptime!)
		const uptime = prettySeconds(process.uptime())
		await ctx.reply(`El bot lleva encendido ${uptime}`);
	},
});
const { commandModule, CommandType } = require('@sern/handler');

export default commandModule({
	name: 'ping',
    type: CommandType.Both,
	plugins: [],
	description: 'A ping command',
	//alias : [],
	execute: async (ctx, args) => {
		await ctx.reply('Hello World!');
	},
});
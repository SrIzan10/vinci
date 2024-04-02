import { discordEvent } from '@sern/handler';

export default discordEvent({
	name: 'messageCreate',
	async execute(msg) {
		if (msg.channel.id !== process.env.T_CHANNEL) return;
		if (msg.content !== 'T')
			return await msg.delete();
	}
});
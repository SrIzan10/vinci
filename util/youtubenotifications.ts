import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import axios from 'axios';
import schema from '../schemas/youtube.js';

export default async function youtubenotifications(client: Client) {
	const db = await schema.findOne({ name: 'elpady' });
	const request = await axios
		.get(
			'https://decapi.me/youtube/latest_video?id=UC9G2yvrtrPeJFEzwlshg5HA&format={id}'
		)
		.then((res) => res.data);
	const titlerequest = await axios
		.get(
			'https://decapi.me/youtube/latest_video?id=UC9G2yvrtrPeJFEzwlshg5HA&format={title}'
		)
		.then((res) => res.data);
	const fetchTextChannel = (await (
		await client.guilds.fetch(process.env.GUILDID!)
	).channels.fetch(process.env.SOCIALS_CHANNEL!)) as TextChannel;
	if (request === db!.id) return;
	else {
		db!.id = request;
		await db?.save();
		const embed = new EmbedBuilder()
			.setAuthor({
				name: 'Mara Turing',
				iconURL:
					'https://yt3.ggpht.com/ytc/AMLnZu8rf3ZxWKKv9Dr6UjmWiDuKkaK06J5lDZ8WwwCg=s88-c-k-c0x00ffffff-no-rj',
			})
			.setColor('Red')
			.setTitle(`${titlerequest}`)
			.setURL(`https://youtu.be/${request}`)
			.setImage(`https://img.youtube.com/vi/${request}/hqdefault.jpg`);
		const message = await fetchTextChannel.send({
			content: 'Nuevo vídeo de Mara Turing, corre a verlo!',
			embeds: [embed],
		});
		message.react('<:Pog:1030169609178976346>');
	}
}

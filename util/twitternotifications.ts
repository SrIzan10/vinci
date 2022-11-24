import { Client, TextChannel } from 'discord.js';
import axios from 'axios';
import schema from '../schemas/twitter.js';

export default async function twitternotifications(client: Client) {
	const db = await schema.findOne({ user: 'elpady' });
	const request = (
		await axios
			.get(
				'https://api.twitter.com/2/tweets/search/recent?query=from%3AMaraTuring',
				{
					headers: {
						Authorization: `Bearer ${process.env.TWITTER}`,
					},
				}
			)
			.then((res) => res.data)
	).data[0].id;
	const fetchTextChannel = (await (
		await client.guilds.fetch(process.env.GUILDID!)
	).channels.fetch(process.env.SOCIALS_CHANNEL!)) as TextChannel;
	if (request === db?.id) return;
	else {
		db!.id = request;
		await db?.save();
		const message = await fetchTextChannel.send({
			content: `Nuevo tweet de Mara Turing, corre a verlo! https://twitter.com/MaraTuring/status/${request}`,
		});
		message.react('<:Pog:1030169609178976346>');
	}
}

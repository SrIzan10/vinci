import { Client, EmbedBuilder, TextChannel } from "discord.js";
import axios from "axios";
import schema from "../schemas/youtube.js";

export default async function youtubenotifications(client: Client) {
	const db = await schema.findOne({ name: "elpady" });
	const request = await axios
		.get(
			"https://decapi.me/youtube/latest_video?id=UC9G2yvrtrPeJFEzwlshg5HA&format={id}"
		)
		.then((res) => res.data);
	const noembed = await axios
		.get(`https://noembed.com/embed?url=https://youtube.com/watch?v=${request}`)
		.then((res) => res.data);
	const fetchTextChannel = (await (
		await client.guilds.fetch("928018226330337280")
	).channels.fetch("948690278498320404")) as TextChannel;
	if (request === db!.id) return;
	else {
		db!.id = request;
		await db?.save();
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Mara Turing",
				iconURL:
					"https://yt3.ggpht.com/ytc/AMLnZu8rf3ZxWKKv9Dr6UjmWiDuKkaK06J5lDZ8WwwCg=s88-c-k-c0x00ffffff-no-rj",
			})
			.setColor("Random")
			.setTitle(`${noembed.title}`)
			.setURL("https://youtu.be/" + request)
			.setImage(`${noembed.thumbnail_url}`);
		const message = await fetchTextChannel.send({
			content: "Nuevo vídeo de Mara Turing, corre a verlo!",
			embeds: [embed],
		});
		message.react("<:Pog:1030169609178976346>");
	}
}

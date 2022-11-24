import { commandModule, CommandType } from "@sern/handler";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApplicationCommandOptionType } from "discord.js";
import { publish } from "../../src/plugins/publish.js";

export default commandModule({
	name: "acortar",
	type: CommandType.Slash,
	plugins: [
		publish(),
	],
	description: "Acorta una URL a vinci.tk",
	options: [
		{
			name: "url",
			description: "la URL larga",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	//alias : [],
	execute: async (ctx, options) => {
		const url = options[1].getString("url", true);
		const request = await axios(
			`https://vinci.tk/yourls-api.php?signature=${process.env.YOURLS_KEY}&action=shorturl&format=json&url=${url}`,
			{
				validateStatus: function (status) {
					return status === 200 || status === 400;
				},
			}
		).then((res: AxiosResponse) => res.data);
		ctx.reply({
			content: `URL acortada: <${request.shorturl}>\nURL original: <${url}>`,
			ephemeral: true,
		});
	},
});

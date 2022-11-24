import { commandModule, CommandType } from '@sern/handler'
import axios from "axios";
import { publish } from "../../src/plugins/publish.js";

export default commandModule({
	name: 'chiste',
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'Enseña un chiste en inglés.',
	execute: async (ctx, args) => {
		const jokeJSON = await axios(
			'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Spooky,Christmas?blacklistFlags=nsfw,religious,racist,sexist,explicit'
		  ).then((res) => res.data);
		ctx.reply({content: `${jokeJSON.joke || jokeJSON.setup}\n${jokeJSON.delivery || ""}`})
}})
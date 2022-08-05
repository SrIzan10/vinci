const { commandModule, CommandType } = require('@sern/handler');
import axios from "axios";
import { publish } from "../../src/plugins/publish";

export default commandModule({
	name: 'chiste',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280'])],
	description: 'Enseña un chiste en inglés.',
	alias : ['joke'],
	execute: async (ctx, args) => {
		const jokeJSON = await axios(
			'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Spooky,Christmas?blacklistFlags=nsfw,religious,racist,sexist,explicit'
		  ).then((res) => res.data);
		ctx.reply({content: `${jokeJSON.joke || jokeJSON.setup}\n${jokeJSON.delivery || ""}`})
}})
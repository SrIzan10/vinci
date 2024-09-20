import { commandModule, CommandType } from '@sern/handler'
import axios from "axios";


export default commandModule({
	name: 'chiste',
    type: CommandType.Slash,
	plugins: [],
	description: 'Enseña un chiste en inglés.',
	execute: async (ctx) => {
		const jokeJSON = await axios(
			'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Spooky,Christmas?blacklistFlags=nsfw,religious,racist,sexist,explicit'
		  ).then((res) => res.data);
		ctx.reply({content: `${jokeJSON.joke || jokeJSON.setup}\n${jokeJSON.delivery || ""}`})
}})
const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../src/plugins/publish";
const got = require("got");

export default commandModule({
	name: 'chiste',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280'])],
	description: 'Enseña un chiste en inglés.',
	alias : ['joke'],
	execute: async (ctx, args) => {
		const request = got('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=json').then(res => 
		{ctx.reply({content: `${res.joke || res.setup}\n${res.delivery}`})})
	}
});
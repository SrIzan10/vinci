const { commandModule, CommandType } = require('@sern/handler');
const got = require("got");
import { publish } from "../src/plugins/publish";

export default commandModule({
	name: 'chiste',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280'])],
	description: 'Enseña un chiste en inglés.',
	alias : ['joke'],
	execute: async (ctx, args) => {
		got('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=txt').then(res => {
        ctx.reply(res)
    });
	},
});
const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";

export default commandModule({
	name: 'a',
    type: CommandType.Both,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'A',
	//alias : [],
	execute: async (ctx, options) => {
		const imagesArray = [
			'./images/XaviXE.png',
			// 'images/Paula.png',
			'./images/William.png',
			'./images/Espejito2500.png',
			'./images/Paula.png',
			'./images/Wheelook.png',
			'./images/MarioCabrera.png',
			'./images/Paticama.png',
			'./images/Vinci.png',
			'./images/SrIzan.png'
		]
		const images = imagesArray[Math.floor(Math.random() * imagesArray.length)];

		await ctx.reply({content: 'A', files: [images]});
	},
});
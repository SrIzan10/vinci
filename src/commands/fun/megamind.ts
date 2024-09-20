import { commandModule, CommandType } from '@sern/handler'

import { ownerOnly } from "#plugins";
import Canvas from '@napi-rs/canvas';
import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
/*

import { ownerOnly } from "#plugins"
*/

export default commandModule({
    type: CommandType.Slash,
	plugins: [],
	// , '928018226330337280'
	description: 'Añade a una imagen de megamind "No ...?"',
	//alias : [],
	options: [
		{
			name: 'texto',
			description: 'El texto SIN "No" ni "?".',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	execute: async (ctx) => {
		const option = ctx.options.getString('texto', true)
		
		await ctx.reply({content: 'Cargando...'})
		
		const before = performance.now()

		const canvas = Canvas.createCanvas(535, 540)
		const context = canvas.getContext('2d')

		const background = await Canvas.loadImage('./images/megamind/megamind.png')
		context.drawImage(background, 0, 0, canvas.width, canvas.height)

		const text = `No ${option}?`
		let fontsize = 60
		do {
			fontsize--;
			context.font = fontsize + "px Impact";
		} while (context.measureText(text).width > canvas.width)
		context.fillStyle = 'white'
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		context.fillText(text, canvas.width / 2, canvas.height - 510)
		
		const encode = await canvas.encode('png')

		const after = performance.now()
		
		const attachment = new AttachmentBuilder(encode, { name: 'megamind.png' });
		await ctx.interaction.editReply({
			content: `Aquí está tu megamind:\nLa generación de imagen ha tardado \`${(after - before).toFixed(2)}ms\`.`,
			files: [attachment]
		})
	},
});

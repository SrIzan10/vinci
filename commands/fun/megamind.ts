import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import Canvas from '@napi-rs/canvas';
import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
    type: CommandType.Slash,
	plugins: [publish()],
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
	execute: async (ctx, options) => {
		const option = options[1].getString('texto', true)
		if (option.length > 26) return await ctx.reply({content: `El texto es muy largo, intenta que sea menor que 26 caracteres.`, ephemeral: true})
		
		await ctx.reply({content: 'Cargando...'})
		
		const before = performance.now()

		const canvas = Canvas.createCanvas(535, 540)
		const context = canvas.getContext('2d')

		const background = await Canvas.loadImage('./images/megamind/megamind.png')
		context.drawImage(background, 0, 0, canvas.width, canvas.height)

		const text = `No ${option}?`
		context.font = '40px Ubuntu'
		context.fillStyle = 'red'
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		context.fillText(text, canvas.width / 2, canvas.height - 510)
		
		const encode = await canvas.encode('png')

		const after = performance.now()
		
		const attachment = new AttachmentBuilder(encode, { name: 'profile-image.png' });
		await ctx.interaction.editReply({
			content: `Aquí está tu megamind:\nLa generación de imagen ha tardado \`${(after - before).toFixed(2)}ms\`.`,
			files: [attachment]
		})
	},
});
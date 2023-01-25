import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../plugins/publish.js";
import FormData from 'form-data';
import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
import axios from 'axios';
/*
import { publish } from "#plugins";
import { ownerOnly } from "#plugins"
*/

export default commandModule({
    type: CommandType.Slash,
	plugins: [publish()],
	//alias : [],
	options: [
		{
			name: 'heartlocket',
			description: 'El corazón con una imagen que todos conocemos',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'imagen',
					description: 'Imagen (jpg o png)',
					type: ApplicationCommandOptionType.Attachment,
					required: true
				},
				{
					name: 'texto',
					description: 'El texto que poner',
					type: ApplicationCommandOptionType.String,
				}
			]
		}
	],
	execute: async (ctx, options) => {
		await ctx.interaction.deferReply()
		switch (options[1].getSubcommand()) {
			case 'heartlocket': {
				try {
					// get all options
					const text = options[1].getString('texto')
					const image = options[1].getAttachment('imagen', true)

					// check file extension of attachment
					if (!image.contentType!.includes('image/png') && !image.contentType!.includes('image/jpeg'))
						return await ctx.interaction.editReply({content: 'Tienes que usar una imagen con extensión `.png` o `.jpg`!'})

					// save in a const the content type
					let fileExtension: string
					if (image.contentType!.includes('image/png')) {
						fileExtension = 'png'
					} else if (image.contentType!.includes('image/jpeg')) {
						fileExtension = 'jpg'
					} else {
						fileExtension = 'this shouldnt be seen, but typescript is sometimes an idiot and it needs an else so it doesnt cry'
					}
					
					// convert image to a binary so it can be sent to the MakeSweet API.
					const formData = new FormData()
					const imageBinary = await axios.get(image.url, { responseType: 'arraybuffer' }).then(res => res.data)
					const buffer = Buffer.from(imageBinary, 'binary');
					formData.append('images[]', buffer, `image.${fileExtension}`)

					// make the request to the actual API, but first check if there's text.
					let request: any
					if (text) {
						request = await axios.post(`https://api.makesweet.com/make/heart-locket?text=${text}`, formData, {
							headers: {
								'Authorization': process.env.MAKESWEET!
							},
							responseType: 'arraybuffer'
						}).then(res => res.data)
					} else {
						request = await axios.post(`https://api.makesweet.com/make/heart-locket`, formData, {
							headers: {
								'Authorization': process.env.MAKESWEET!
							},
							responseType: 'arraybuffer'
						}).then(res => res.data)
					}

					// make an attachment with the data that the MakeSweet API returned
					const attachment = new AttachmentBuilder(request, { name: 'makesweet.gif' })

					// finally, send the message
					await ctx.interaction.editReply({
						content: 'Tu GIF está listo! 🎉',
						files: [attachment]
					})
				} catch (e) {
					await ctx.interaction.editReply({
						content: `Algo ha pasado mal, intenta comprimir la imagen para hacerla menos pesada antes de enviarla.`
					})
				}
			} break;
		}
	},
});
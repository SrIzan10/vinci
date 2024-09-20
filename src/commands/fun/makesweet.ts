import { commandModule, CommandType } from '@sern/handler';
import { publish } from '#plugins';
import FormData from 'form-data';
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js';
import axios from 'axios';
import https from 'node:https'
/*

import { ownerOnly } from "#plugins"
*/

export default commandModule({
	type: CommandType.Slash,
	plugins: [],
	//alias : [],
	description: 'no one will read this (i hope)',
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
					required: true,
				},
				{
					name: 'texto',
					description: 'El texto que poner',
					type: ApplicationCommandOptionType.String,
				},
			],
		},
	],
	execute: async (ctx) => {
		await ctx.interaction.deferReply();
		switch (ctx.options.getSubcommand()) {
			case 'heartlocket':
				{
					try {
						// get all options
						const text = ctx.options.getString('texto', true);
						const image = ctx.options.getAttachment('imagen', true);

						// check file extension of attachment
						if (
							!image.contentType!.includes('image/png') &&
							!image.contentType!.includes('image/jpeg')
						)
							return await ctx.interaction.editReply({
								content:
									'Tienes que usar una imagen con extensión `.png` o `.jpg`!',
							});

						// save in a const the content type
						let fileExtension: string;
						if (image.contentType!.includes('image/png')) {
							fileExtension = 'png';
						} else if (image.contentType!.includes('image/jpeg')) {
							fileExtension = 'jpg';
						} else {
							fileExtension =
								'this shouldnt be seen, but typescript is sometimes an idiot and it needs an else so it doesnt cry';
						}

						// upload to tmpfiles so it can be then uploaded to 
						const formDataTemp = new FormData();
						const imageBinaryTemp = await axios
							.get(image.url, { responseType: 'arraybuffer' })
							.then((res) => res.data);
						const bufferTemp = Buffer.from(imageBinaryTemp, 'binary');
						formDataTemp.append('file', bufferTemp, `image.${fileExtension}`);
						const tempupload = await axios
								.post(
									`https://tmpfiles.org/api/v1/upload`,
									formDataTemp,
								)
								.then((res) => res.data);

						// compress the image
						const compress = await axios.get(`https://api.resmush.it/ws.php?img=${(tempupload.data.url as string).replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/')}&qlty=80`, {
							httpsAgent: new https.Agent({ rejectUnauthorized: false })
						}).then(res => res.data)
						
						// convert image to a binary so it can be sent to the MakeSweet API.
						const formData = new FormData();
						const imageBinary = await axios
							.get((compress.dest as string).replace(/\\\//g, '/'), { responseType: 'arraybuffer' })
							.then((res) => res.data);
						const buffer = Buffer.from(imageBinary, 'binary');
						formData.append('images[]', buffer, `image.${fileExtension}`);

						// make the request to the actual API, but first check if there's text.
						let request: any;
						if (text) {
							request = await axios
								.post(
									`https://api.makesweet.com/make/heart-locket?text=${text}`,
									formData,
									{
										headers: {
											Authorization: process.env.MAKESWEET!,
										},
										responseType: 'arraybuffer',
										httpsAgent: new https.Agent({ rejectUnauthorized: false })
									}
								)
								.then((res) => res.data);
						} else {
							request = await axios
								.post(`https://api.makesweet.com/make/heart-locket`, formData, {
									headers: {
										Authorization: process.env.MAKESWEET!,
									},
									responseType: 'arraybuffer',
									httpsAgent: new https.Agent({ rejectUnauthorized: false })
								})
								.then((res) => res.data);
						}

						// make an attachment with the data that the MakeSweet API returned
						const attachment = new AttachmentBuilder(request, {
							name: 'makesweet.gif',
						});

						// finally, send the message
						const message = await ctx.interaction.editReply({
							content: 'Tu GIF está listo! 🎉',
							files: [attachment],
						});

						// make an image link button
						const button = new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setLabel('Enlace al GIF')
								.setEmoji('📲')
								.setURL(`https://api.srizan.dev/misc/download?url=${message.attachments.first()!.url}&type=gif`)
								.setStyle(ButtonStyle.Link)
						);
						await ctx.interaction.editReply({
							content: 'Tu GIF está listo! 🎉',
							files: [attachment],
							components: [button]
						});
						
					} catch (e) {
						await ctx.interaction.editReply({
							content: `ERROR: He intentado comprimir la imagen, pero no ha sido suficiente. Intenta usar una imagen menos pesada (1mb o menos)\nSi no es eso, probablemente ha ocurrido un error del que no tengo conocimiento.`,
						});
					}
				}
				break;
		}
	},
});

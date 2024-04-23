import { commandModule, CommandType } from '@sern/handler';
import { publish } from '#plugins';
import { AttachmentBuilder, codeBlock } from 'discord.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import sharp from 'sharp';

export default commandModule({
	name: 'Clasifica una imagen',
	type: CommandType.CtxMsg,
	plugins: [publish()],
	execute: async (ctx) => {
		await ctx.deferReply()
		
		if (ctx.targetMessage.attachments.size === 0) return ctx.editReply('No hay ninguna imagen para clasificar!');
		const image = ctx.targetMessage.attachments.first();
		if (!image.contentType.startsWith('image/') && image.contentType !== 'image/gif') return ctx.editReply('El archivo no es una imagen!');

		const imageBuffer = await fetch(image.url).then(async res => await res.arrayBuffer());
		const compressed = sharp(imageBuffer)
			.png({quality: 70})
			.jpeg({quality: 70})
			.webp({quality: 70})
			.tiff({quality: 70});
		const metadata = await compressed.metadata();
		const imageUint8Array = new Uint8Array(await compressed.toBuffer());

		const request = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_AI_ACC}/ai/run/@cf/facebook/detr-resnet-50`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${process.env.CF_AI_TOKEN}`,
			},
			body: imageUint8Array,
		}).then(async res => await res.json());
		if (request.errors.length > 0) return ctx.editReply(`Hubo un error! ${codeBlock(JSON.stringify(request.errors))}`);

		// all canvas stuff, this was fun to make
		const canvas = createCanvas(metadata.width, metadata.height);
		const ctxCanvas = canvas.getContext('2d');
		const img = await loadImage(image.url);
		ctxCanvas.drawImage(img, 0, 0, metadata.width, metadata.height);
		ctxCanvas.font = '30px sans-serif';
		ctxCanvas.fillStyle = 'red';
		ctxCanvas.strokeStyle = 'red';
		ctxCanvas.lineWidth = 3;
		for (const result of request.result) {
			if (result.score < 0.5) continue;
			const box = result.box;
			ctxCanvas.strokeRect(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);
			ctxCanvas.fillText(result.label, box.xmin, box.ymin - 5);
		}
		const canvasBuffer = canvas.toBuffer('image/png');
		const attachment = new AttachmentBuilder(canvasBuffer, { name: 'generatedImage.png' });

		await ctx.editReply({ files: [attachment] })
	},
});
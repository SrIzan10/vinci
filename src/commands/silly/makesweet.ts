import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
import sharp from 'sharp';

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
            const text = ctx.options.getString('texto');
            const image = ctx.options.getAttachment('imagen', true);

            if (
              !image.contentType!.includes('image/png') &&
              !image.contentType!.includes('image/jpeg')
            )
              return await ctx.interaction.editReply({
                content: 'Tienes que usar una imagen con extensión `.png` o `.jpg`!',
              });

            const fileExtension = image.contentType!.split('/')[1];
            const imageBuffer = await fetch(image.url, {
              headers: { 'User-Agent': 'Vinci/1.0' },
            }).then((res) => res.arrayBuffer());
            const compressedImage = await sharp(imageBuffer)
              .jpeg({ mozjpeg: true, quality: 80 })
              .png({ quality: 80 })
              .toBuffer();

            const formData = new FormData();
            const blob = new Blob([compressedImage], { type: `image/${fileExtension}` });
            formData.append('images[]', blob, `image.${fileExtension}`);

            const res = await fetch(
              `https://api.makesweet.com/make/heart-locket${text ? `?text=${text}` : ''}`,
              {
                method: 'POST',
                headers: {
                  Authorization: process.env.MAKESWEET!,
                },
                body: formData,
              }
            ).then((r) => r.arrayBuffer());

            const attachment = new AttachmentBuilder(Buffer.from(res), {
              name: 'makesweet.gif',
            });

            await ctx.interaction.editReply({
              content: 'Tu GIF está listo! 🎉',
              files: [attachment],
            });
          } catch (e) {
            console.error(e);
            await ctx.interaction.editReply({
              content: `ERROR: He intentado comprimir la imagen, pero no ha sido suficiente. Intenta usar una imagen menos pesada (1mb o menos)\nSi no es eso, probablemente ha ocurrido un error del que no tengo conocimiento.`,
            });
          }
        }
        break;
    }
  },
});

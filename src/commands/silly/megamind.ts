import * as Canvas from '@napi-rs/canvas';
import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, AttachmentBuilder, codeBlock } from 'discord.js';

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: 'no unstable vinci?',
  options: [
    {
      name: 'texto',
      description: 'El texto SIN "No" ni "?".',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const texto = `No ${ctx.options.getString('texto', true)}?`;

    await ctx.reply('Cargando...');

    const before = performance.now();

    const canvas = Canvas.createCanvas(535, 540);
    const ctxCanvas = canvas.getContext('2d');

    const background = await Canvas.loadImage('./images/megamind/megamind.png');
    ctxCanvas.drawImage(background, 0, 0, canvas.width, canvas.height);

    let fontSize = 60;
    do {
      fontSize--;
      ctxCanvas.font = `${fontSize}px Impact`;
    } while (ctxCanvas.measureText(texto).width > canvas.width);
    ctxCanvas.fillStyle = 'white';
    ctxCanvas.textAlign = 'center';
    ctxCanvas.textBaseline = 'middle';
    ctxCanvas.strokeStyle = 'black';
    ctxCanvas.lineWidth = 4;
    ctxCanvas.strokeText(texto, canvas.width / 2, canvas.height - 510);
    ctxCanvas.fillText(texto, canvas.width / 2, canvas.height - 510);

    const encode = await canvas.encode('png');

    const after = performance.now();

    const attachment = new AttachmentBuilder(encode, { name: 'megamind.png' });
    await ctx.interaction.editReply({
      content: `Tiempo de generación: ${codeBlock((after - before).toFixed(2))}ms`,
      files: [attachment],
    });
  },
});

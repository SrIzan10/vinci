import { createCanvas, loadImage } from '@napi-rs/canvas';
import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, AttachmentBuilder, GuildMember } from 'discord.js';

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: 'A',
  options: [
    {
      name: 'persona',
      description: 'Persona para generar la imagen',
      type: ApplicationCommandOptionType.User,
    },
  ],
  execute: async (ctx) => {
    const member = (ctx.options.getMember('persona') ?? ctx.interaction.member) as GuildMember;
    if (member.user.bot) {
      return await ctx.reply({
        content: 'no he implementado el badge de bot, y me da pereza hacerlo ahora mismo.',
        ephemeral: true,
      });
    }

    const canvas = createCanvas(500, 60);
    const ctxCanvas = canvas.getContext('2d');

    // canvas background
    ctxCanvas.fillStyle = '#36393F';
    ctxCanvas.fillRect(0, 0, canvas.width, canvas.height);
    ctxCanvas.save();

    // add avatar circle
    const avatarBuffer = await fetch(member?.displayAvatarURL({ size: 128, extension: 'png' }))
      .then((res) => res.arrayBuffer());
    const avatarImage = await loadImage(Buffer.from(avatarBuffer));
    ctxCanvas.beginPath();
    ctxCanvas.arc(36, 28, 20, 0, Math.PI * 2);
    ctxCanvas.clip();
    ctxCanvas.drawImage(avatarImage, 16, 8, 40, 40);
    ctxCanvas.restore();
    ctxCanvas.save();

    // add username and timestamp
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    ctxCanvas.fillStyle = member.displayColor ? `#${member.displayColor.toString(16).padStart(6, '0')}` : '#FFFFFF';
    ctxCanvas.font = '16px Noto Sans';
    ctxCanvas.fillText(member.displayName, 72, 23);
    
    // add timestamp
    const usernameWidth = ctxCanvas.measureText(member.displayName).width;
    ctxCanvas.fillStyle = '#72767D';
    ctxCanvas.font = '12px Noto Sans';
    ctxCanvas.fillText(` ${timestamp}`, 72 + usernameWidth + 8, 23);
    ctxCanvas.restore();
    ctxCanvas.save();

    // message content
    ctxCanvas.fillStyle = '#DCDDDE';
    ctxCanvas.font = '16px Noto Sans';
    ctxCanvas.fillText('A', 72, 45);
    ctxCanvas.restore();
    ctxCanvas.save();


    const attachment = new AttachmentBuilder(await canvas.encode('png'), {
      name: 'a.png',
    });
    await ctx.reply({
      content: 'A',
      files: [attachment],
    });
  },
});

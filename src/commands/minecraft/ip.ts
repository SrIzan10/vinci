import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
  name: 'ip',
  type: CommandType.Slash,
  plugins: [],
  description: 'La IP del servidor de Minecraft',
  options: [
    {
      name: 'usuario',
      description: 'Menciona al usuario al que va dirigido el comando.',
      type: ApplicationCommandOptionType.User,
    },
  ],
  execute: async (ctx) => {
    const usuario = ctx.options.getMember('usuario');
    const message = 'La IP del servidor de Minecraft es `minecraft.maraturing.com`,\nPide acceso con el comando `/mcform`.'

    if (!usuario) {
      await ctx.reply({
        content: message,
        ephemeral: true,
      });
    } else {
      await ctx.reply({
        content: `${usuario}, ${message}`,
      });
    }
  },
});

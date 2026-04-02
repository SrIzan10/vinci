import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: 'acorta una url',
  options: [
    {
      name: 'url',
      description: 'la url a acortar',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'alias',
      description: 'alias opcional para la url acortada',
      type: ApplicationCommandOptionType.String,
      required: false,
    }
  ],
  execute: async (ctx) => {
    const url = ctx.options.getString('url', true);
    const alias = ctx.options.getString('alias');

    const res = await fetch('https://spoo.me', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        url,
        // idk why copilot did that but ok
        ...(alias && { alias })
      })
    }).then(r => r.json());

    if (res.error) {
      return ctx.reply({
        content: `Error al acortar la URL: ${res.message}`,
        ephemeral: true,
      });
    }

    if (res.short_url) {
      return ctx.reply({
        content: `URL acortada: ${res.short_url}`,
        ephemeral: true,
      });
    }

    return ctx.reply({
      content: `Algo no ha ido bien!`,
      ephemeral: true,
    });
  },
});
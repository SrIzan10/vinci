// command of the year

import { commandModule, CommandType } from '@sern/handler';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } from 'discord.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [],
    description: 'look stuff up on google',
    options: [{
        name: 'query',
        description: 'the query to search for',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    execute: async (ctx) => {
        const query = ctx.options.getString('query', true);
        const url = `https://google.com/search?q=${encodeURIComponent(query)}`;

        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel('abrir enlace')
            .setStyle(ButtonStyle.Link)
            .setURL(url),
        )
        await ctx.reply({
            content: `<${url}>`,
            components: [button],
        });
    },
});
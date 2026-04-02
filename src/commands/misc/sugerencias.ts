import { commandModule, CommandType } from '@sern/handler';
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalActionRowComponentBuilder,
} from 'discord.js';

export default commandModule({
  name: 'sugerencias',
  type: CommandType.Slash,
  plugins: [],
  description: 'Envia una sugerencia.',
  execute: async (ctx) => {
    const modal = new ModalBuilder().setCustomId('sugerencias').setTitle('Sugerencias');

    const input = new TextInputBuilder()
      .setCustomId('sugerenciasInput')
      .setLabel('Tienes sugerencias?')
      .setStyle(TextInputStyle.Paragraph);
    const suggestionsActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);
    modal.addComponents(suggestionsActionRow);
    await ctx.interaction.showModal(modal);
  },
});

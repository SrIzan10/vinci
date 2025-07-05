import { commandModule, CommandType } from '@sern/handler';
import {
  ActionRow,
  ActionRowBuilder,
  APIButtonComponentWithCustomId,
  ButtonBuilder,
  ButtonComponent,
  ButtonComponentData,
  ButtonStyle,
  MessageActionRowComponent,
} from 'discord.js';
import db from '../../utils/db';

export default commandModule({
  type: CommandType.Button,
  async execute(interaction) {
    const row1 = interaction.message!.components[0] as ActionRow<MessageActionRowComponent>;
    const row2 = interaction.message!.components[1] as ActionRow<MessageActionRowComponent>;
    const rows = {
      yes: row1.components[0],
      no: row1.components[1],
      yesWho: row2.components[0],
      noWho: row2.components[1],
    } as {
      yes: ButtonComponent;
      no: ButtonComponent;
      yesWho: ButtonComponent;
      noWho: ButtonComponent;
    };
    const upvoteData = rows.yes.data as APIButtonComponentWithCustomId;
    const downvoteData = rows.no.data as APIButtonComponentWithCustomId;
    const userSuggestion = await db.suggestion.findFirst({
      where: { msgId: interaction.message.id, userId: interaction.user.id },
    });

    if (!userSuggestion) {
      const row1 = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder(rows.yes.data).setLabel((parseInt(upvoteData.label!) + 1).toString()),
        new ButtonBuilder(rows.no.data)
      );

      await db.suggestion.create({
        data: {
          msgId: interaction.message.id,
          userId: interaction.user.id,
          upDown: 1,
        },
      });
      await interaction.message.edit({ components: [row1, row2] });
      await interaction.deferUpdate();
      return;
    }

    const userSuggestionUpDown = userSuggestion.upDown === 1;
    if (userSuggestionUpDown) {
      await interaction.deferUpdate()
      return;
    } else {
      await db.suggestion.updateMany({
        where: { msgId: interaction.message.id, userId: interaction.user.id, upDown: -1 },
        data: { upDown: 1 },
      });

      const row1 = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder(rows.yes.data).setLabel((parseInt(upvoteData.label!) + 1).toString()),
        new ButtonBuilder(rows.no.data).setLabel((parseInt(downvoteData.label!) - 1).toString())
      );
      await interaction.message.edit({ components: [row1, row2] });
      await interaction.deferUpdate();
      return;
    }
  },
});

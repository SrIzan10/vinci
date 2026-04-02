import { commandModule, CommandType } from '@sern/handler';
import db from '../../utils/db';

export default commandModule({
  type: CommandType.Button,
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const votes = await db.suggestion.findMany({
      where: { msgId: interaction.message.id, upDown: -1 },
    });
    const fetchedIds = await Promise.all(
      votes.map(async (v) => {
        return interaction.client.users.fetch(v.userId);
      })
    );
    await interaction.editReply({
      content: `Gente que ha hecho downvote:\n${
        fetchedIds.length > 0 ? fetchedIds.join(', ') : 'Nadie, de momento'
      }`,
      allowedMentions: { repliedUser: false },
    });
  },
});

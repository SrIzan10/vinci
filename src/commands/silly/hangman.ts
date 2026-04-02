import { Palabra } from '#/db/dict.types';
import { WordController } from '#/wordController';
import { commandModule, CommandType } from '@sern/handler';
import { ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const helpText = `
## whar
se tiene en cuenta la cabeza, el cuerpo, pierna izquierda, pierna derecha, brazo izquierdo y brazo derecho.
## quiero palabras que no sean 6 letras
talk is cheap, send patches
## porque la palabra es tan rara
Las palabras son como espejos del alma colectiva - lo que nos parece extraño revela más sobre nosotros que sobre la palabra misma. En el juego del ahorcado, como en la vida, enfrentamos lo desconocido con la esperanza de que nuestras conjeturas nos acerquen a la verdad. Cada palabra "rara" es una invitación a expandir los límites de nuestro entendimiento.
`;

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: 'hang, man',
  //alias : [],
  execute: async (ctx, sdt) => {
    const dict = sdt.deps.dict;
    const { palabra } = (await dict
      .query('select palabra from palabra where length(palabra) = 6 order by random() limit 1')
      .get()) as Record<'palabra', Palabra['palabra']>;

    const wordcon = new WordController(palabra, ctx);
    let lastSubmitUserId = '';

    const collector = (await wordcon.getMessage())!.createMessageComponentCollector({
      time: 180_000, // 3 minutes
    });
    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'hangman-answer') {
        if (interaction.user.id !== lastSubmitUserId) {
          lastSubmitUserId = interaction.user.id;
        } else {
          if (process.env.NODE_ENV === 'development') return;
          const i = await interaction.reply({
            content: 'Ya has respondido, espera a que se acabe el tiempo.\nEsto se elimina en 2 segundos, no te preocupes por cerrarlo.',
            ephemeral: true,
          });
          setTimeout(() => i.delete().catch(() => { }), 2000);
          return;
        }

        await interaction.showModal({
          title: 'Responde',
          customId: 'hangman-answer-modal',
          components: [
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId('hangman-answer-input')
                .setLabel('Tu respuesta')
                .setStyle(TextInputStyle.Short)
            ),
          ],
        });
        const submitted = await interaction.awaitModalSubmit({
          time: 30_000,
          filter: (i) => i.user.id === interaction.user.id,
        });
        wordcon.submitLetter(
          submitted.fields.getTextInputValue('hangman-answer-input').toLowerCase()
        );
        await submitted.deferUpdate();
      } else if (interaction.customId === 'hangman-help') {
        await interaction.reply({ content: helpText, ephemeral: true });
      }
    });
    
    const gameOver = async (won = false) => {
      (await wordcon.getMessage())!.edit({
        content: `la palabra era \`${palabra}\`. ${won ? 'enhorabuena!' : 'vaya hombre...'}`,
        components: [],
      });
      collector.stop();
    };
    const editMsgContent = async () => {
      const msg = await wordcon.getMessage();
      if (msg) {
        await msg.edit({
          content: `**Incorrectas:** ${wordcon.data.incorrect.join(', ')}\n**Correctas:** ${wordcon.data.correct.join(', ')}\nÚltima letra enviada por ${lastSubmitUserId ? `<@${lastSubmitUserId}>` : 'nadie'}`,
          allowedMentions: { users: [] },
        });
      }
    };

    collector.on('end', async (_, reason) => {
      await gameOver(reason === 'time' ? false : true);
    });
    wordcon.on('correct', async () => {
      if (wordcon.data.correct.length === palabra.length) {
        return await gameOver(true);
      }
      await editMsgContent();
    });
    wordcon.on('incorrect', async () => {
      await editMsgContent();
    });
    wordcon.on('gameOver', async () => {
      await gameOver();
    });
  },
});

import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';
import { readFileSync } from 'fs';

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: 'Añade tu cumpleaños',
  options: [
    {
      name: 'fecha',
      description: 'La fecha de tu cumple (D-M) (elige en el autocompletado)',
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
      required: true,
      command: {
        onEvent: [],
        execute: async (autocomplete) => {
          const focusedValue = autocomplete.options.getFocused();
          let choices = JSON.parse(readFileSync('./assets/daysinyear.json').toString()) as string[];
          choices = choices.filter((choice) => choice.startsWith(focusedValue));
          choices = choices.slice(0, 25);
          await autocomplete.respond(
            choices.map((choice) => ({
              name: choice,
              value: choice,
            }))
          );
        },
      },
    },
  ],
  execute: async (ctx, sdt) => {
    const date = ctx.interaction.options.getString('fecha', true);

    const existing = await sdt.deps.prisma.birthday.findUnique({
      where: { userId: ctx.user.id },
    });

    if (existing) {
      await sdt.deps.prisma.birthday.update({
        where: { userId: ctx.user.id },
        data: { date },
      });
      await ctx.reply({
        content: `cumpleaños actualizado a ${date}!`,
        ephemeral: true,
      });
    } else {
      await sdt.deps.prisma.birthday.create({
        data: {
          userId: ctx.user.id,
          date,
        },
      });
      await ctx.reply({
        content: `cumpleaños registrado para el ${date}!`,
        ephemeral: true,
      });
    }
  },
});

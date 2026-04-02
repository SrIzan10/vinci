import { fisherYatesShuffle } from '../../utils/fisheryates.js';
import { commandModule, CommandType } from '@sern/handler';
import { EmbedBuilder } from 'discord.js';
import { readFile } from 'fs/promises';

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: 'CHISTE',
  options: [],
  execute: async (ctx) => {
    const fileContent = (
      JSON.parse(await readFile('./assets/chistes.json', 'utf-8')) as JokesJSON[]
    )
      // do not ask
      .filter((j) => j.category !== 'sexo');

    const joke = fisherYatesShuffle(fileContent)[0];
    const embed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle(
        joke.keywords === 'pinguino,elchiste,alguienmeobligo'
          ? 'EL CHISTE DEL PINGUINO OMAIGAD'
          : null
      )
      // regex matches both '-' and '- ' and escapes it because of discord markdown
      .setDescription(joke.text.replace(/^-\s?/gm, '\\- '));

    await ctx.reply({ embeds: [embed] });
  },
});

interface JokesJSON {
  id: number;
  text: string;
  keywords: string;
  funny: number;
  category: string;
}

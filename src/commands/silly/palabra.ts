import { Palabra } from '#/db/dict.types';
import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: 'palabra.ts',
  //alias : [],
  execute: async (ctx, sdt) => {
    const dict = sdt.deps.dict;
    const { palabra } = (await dict
      .query('select palabra from palabra order by random() limit 1')
      .get()) as Record<'palabra', Palabra['palabra']>;
    await ctx.reply(palabra);
  },
});

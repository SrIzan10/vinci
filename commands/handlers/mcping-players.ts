import { commandModule, CommandType } from '@sern/handler';
import axios from 'axios';

export default commandModule({
    type: CommandType.Button,
    plugins: [],
    execute: async (ctx) => {
        await ctx.deferReply({ ephemeral: true })
        const request = await axios.get('https://api.minetools.eu/query/minecraft.maraturing.com/25565').then(res => res.data)
        
        await ctx.editReply({
            content: ``
        })
    },
});
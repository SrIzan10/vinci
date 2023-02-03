import { commandModule, CommandType } from '@sern/handler';
import axios from 'axios';
import { AttachmentBuilder, BufferResolvable } from 'discord.js';
import { publish } from '../../plugins/publish.js';
import { Readable } from 'node:stream'

export default commandModule({
    type: CommandType.CtxMsg,
    plugins: [publish()],
    execute: async (ctx) => {
        await ctx.deferReply()

        const text = ctx.targetMessage.content;
        const encodedText = encodeURIComponent(text);
        const url = `https://www.tetyys.com/SAPI4/SAPI4?text=${encodedText}&voice=Adult%20Male%20%232%2C%20American%20English%20(TruVoice)&pitch=140&speed=157`;

        const request = await fetch(url).then(res => res.arrayBuffer())
        const stream = new Readable();
        stream._read = () => {};
        stream.push(Buffer.from(new Uint8Array(request)));
        stream.push(null)

        const attachment = new AttachmentBuilder(stream, { name: 'bonzied.wav' })

        await ctx.editReply({ files: [attachment] })
    },
});
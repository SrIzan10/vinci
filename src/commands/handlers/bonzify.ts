import { commandModule, CommandType } from '@sern/handler';
import { AttachmentBuilder } from 'discord.js';
import { publish } from '#plugins';
import { Readable } from 'node:stream'
import { random } from '../../util/randomstring.js';
import fs from 'fs';
import { execa } from 'execa';

export default commandModule({
    type: CommandType.CtxMsg,
    plugins: [],
    execute: async (ctx) => {
        await ctx.deferReply({ fetchReply: true })

        const text = ctx.targetMessage.content;
        const encodedText = encodeURIComponent(text);
        const url = `https://www.tetyys.com/SAPI4/SAPI4?text=${encodedText}&voice=Adult%20Male%20%232%2C%20American%20English%20(TruVoice)&pitch=140&speed=157`;

        const request = await fetch(url).then(res => res.arrayBuffer())
        await new Promise(resolve => setTimeout(resolve, 500));

        const randomnumber = random(5)
        const randomnumber_wav = `bonzi-wav-${randomnumber}.wav`
        const randomnumber_mp3 = `bonzi-mp3-${randomnumber}.mp3`
        fs.writeFileSync(`./src/util/bonzi_temp/${randomnumber_wav}`, new Uint8Array(request))
        const command = execa('ffmpeg', [
            '-i', `./src/util/bonzi_temp/${randomnumber_wav}`,
            '-vn',
            `./src/util/bonzi_temp/${randomnumber_mp3}`
        ], { shell: true })
        await new Promise((resolve) => {
            command.on('close', resolve)
        })

        const stream = new Readable();
        stream._read = () => {};
        stream.push(Buffer.from(new Uint8Array(fs.readFileSync(`./src/util/bonzi_temp/${randomnumber_mp3}`))));
        stream.push(null)

        const attachment = new AttachmentBuilder(stream, { name: 'bonzied.mp3' })
        fs.unlinkSync(`./src/util/bonzi_temp/${randomnumber_mp3}`)
        fs.unlinkSync(`./src/util/bonzi_temp/${randomnumber_wav}`)

        await ctx.editReply({ files: [attachment] })
    },
});
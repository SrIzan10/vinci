const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import got from "got"
import axios from "axios";
/*
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
*/

export default commandModule({
	name: 'radio',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280']), ownerOnly()],
	description: 'ADMIN: Reproduce la radio',
	//alias : [],
	options: [],
	execute: async (ctx, options) => {
		const stream = await got.stream("https://flucast-m04-06.flumotion.com/cope/rockfm.mp3")
		const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1000402245633966121',guildId: '928018226330337280',selfDeaf: true});
		const resource = createAudioResource(stream, { inlineVolume: true });
		const player = createAudioPlayer();
		connection.subscribe(player)
		player.play(resource)
		resource.volume!.setVolume(0.7)
		/*player.on(AudioPlayerStatus.Playing, () => {});*/
		ctx.reply({content: 'Reproduciendo radio...', ephemeral: true})
	},
});
const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import got from "got"
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
/*
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
*/

export default commandModule({
	name: 'radio',
    type: CommandType.Both,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'Reproduce la radio', 
	options: [
		{
			name: 'reproducir',
			description: 'Reproduce una radio de la lista',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true,
			command: {
				onEvent: [],
				async execute(ctx){
					const focusedValue = ctx.options.getFocused();
					const choices = ['Rock FM', 'Cadena 100', 'Cadena Dial', 'BBC 1', 'BBC 5', 'RNE 1', 'RNE 5', 'Los 40'];
					const filtered = choices.filter(choice => choice.startsWith(focusedValue));
					await ctx.respond(
						filtered.map(choice => ({ name: choice, value: choice })),
					);
				}
			}
		}
	],
	execute: async (ctx, options) => {
		const radioname = options[1].getString("reproducir", true) as string;
		if (radioname === 'Rock FM') {
			const stream = await got.stream("https://flucast-m04-06.flumotion.com/cope/rockfm.mp3")
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
		} else if (radioname === 'Cadena 100') {
			const stream = await got.stream("https://server8.emitironline.com:18196/stream")
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
		} else if (radioname === 'Cadena Dial') {
			const stream = await got.stream("http://20853.live.streamtheworld.com/CADENADIAL.mp3")
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
		} else if (radioname === 'BBC 1') {
			const stream = await got.stream("http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one")
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
		} else if (radioname === 'BBC 5') {
			const stream = await got.stream("https://server8.emitironline.com:18196/stream")
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
		} else if (radioname === 'RNE 1') {
			const stream = await got.stream("https://crtve-rne1-cnr.cast.addradio.de/crtve/rne1/cnr/mp3/high")
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
		} else if (radioname === 'RNE 5') {
			const stream = await got.stream("http://crtve--di--crtve-ice--02--cdn.cast.addradio.de/crtve/rne5/sev/mp3/high")
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
		} else if (radioname === 'Los 40') {
			const stream = await got.stream('http://stream.ondaceronoroeste.es:8000/stream')
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
		}
		const embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle(`Reproduciendo ${radioname} en Vinci Radio.`)
			.setDescription(`A veces la radio tarda en cargar, sé paciente :'D`);
		ctx.reply({embeds: [embed], ephemeral: true})
	},
});
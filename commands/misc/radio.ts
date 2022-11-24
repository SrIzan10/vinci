import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import got from "got";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: 'radio',
    type: CommandType.Slash,
	plugins: [publish()],
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
					const choices = ['Rock FM', 'Cadena 100', 'Cadena Dial', 'Gensokyo Radio', 'BBC 1', 'BBC 5', 'RNE 1', 'RNE 5', 'Los 40'];
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
		const embed = new EmbedBuilder()
			.setColor("Green")
			.setTitle(`Reproduciendo ${radioname} en Vinci Radio.`)
			.setDescription(`A veces la radio tarda en cargar, sé paciente :'D`);
		const notFoundEmbed = new EmbedBuilder()
			.setColor("Red")
			.setTitle(`Radio ${radioname} no encontrada.`)
			.setDescription(`La radio no ha sido encontrada, asegúrate que la radio está escogida de la lista.`);

		async function playRadio(radioname: string) {
			const stream = await got.stream(radioname)
			const connection = joinVoiceChannel({adapterCreator: ctx.guild.voiceAdapterCreator,channelId: '1008730592835281009',guildId: '928018226330337280',selfDeaf: true});
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer();
			connection.subscribe(player)
			player.play(resource)
			resource.volume!.setVolume(0.7)
			await ctx.reply({embeds: [embed], ephemeral: true})
		}

		if (radioname === 'Rock FM') {
			playRadio("https://flucast-m04-06.flumotion.com/cope/rockfm.mp3")
		} else if (radioname === 'Cadena 100') {
			playRadio("https://server8.emitironline.com:18196/stream")
		} else if (radioname === 'Cadena Dial') {
			playRadio("http://20853.live.streamtheworld.com/CADENADIAL.mp3")
		} else if (radioname === 'BBC 1') {
			playRadio("http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one")
		} else if (radioname === 'BBC 5') {
			playRadio("https://server8.emitironline.com:18196/stream")
		} else if (radioname === 'RNE 1') {
			playRadio("https://crtve-rne1-cnr.cast.addradio.de/crtve/rne1/cnr/mp3/high")
		} else if (radioname === 'RNE 5') {
			playRadio("http://crtve--di--crtve-ice--02--cdn.cast.addradio.de/crtve/rne5/sev/mp3/high")
		} else if (radioname === 'Los 40') {
			playRadio('http://stream.ondaceronoroeste.es:8000/stream')
		} else if (radioname === 'Gensokyo Radio') {
			playRadio('https://stream.gensokyoradio.net/3')
		} else {
			ctx.reply({embeds: [notFoundEmbed], ephemeral: true})
		}
	},
});
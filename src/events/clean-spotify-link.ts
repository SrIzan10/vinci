import { Service, discordEvent } from '@sern/handler';
import removeURLParameter from '../util/removeUrlParameter.js';

export default discordEvent({
    name: 'messageCreate',
    async execute(message) {
        const spotify = Service('spotify-api-client')
        if (message.author.bot) return;
        if (!message.content.includes('https://open.spotify.com/intl-es/track')) return;

		const index = message.content.indexOf("https://open.spotify.com/intl-es/track");
		let link: string = ''
		if (index !== -1) {
			let endIndex = message.content.indexOf(" ", index);
			if (endIndex === -1) {
				endIndex = message.content.length;
			}
			link = message.content.substring(index, endIndex);
		}
        const croppedUrl = removeURLParameter(link.replace('intl-es/', '').replaceAll(/([^:]\/)\/+/g, "$1"), 'si');

        const song = await spotify.tracks.get(croppedUrl.split('/').pop()!);

        await message.delete();
        message.channel.send({
            content: `Oye <@${message.author.id}>, tu canción \`${song!.name}\` de \`${song!.artists.map(a => a.name).join(', ')}\` es muy buena, pero si quitas \`intl-es\` es mejor.\n${croppedUrl}`,
        })
    }
  })
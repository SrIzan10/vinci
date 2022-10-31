import axios from "axios";
import { Client, EmbedBuilder, TextChannel } from "discord.js";

export async function nowPlayingRadio(client: Client) {
    const getAPI = await axios.get("https://opml.radiotime.com/Describe.ashx?id=s67006", {validateStatus: function (status) {return status === 200|| status === 403}}).then((res) => res.data).catch((err) => {console.log("now playing radio errored out? diesofcringe")})
    var parser = new DOMParser()
    var XMLDoc = parser.parseFromString(getAPI, "text/xml");
    let getsong, getartist;
    try {
    getsong = XMLDoc.getElementsByTagName("current_song").item(0)!.textContent
    getartist = XMLDoc.getElementsByTagName("current_artist").item(0)!.textContent
    } catch (err) {
    getsong = "Anuncios o cambio de canción"
    getartist = "catJAM"
    }
    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Ahora reproduciendo: ${getsong}`)
        .setAuthor({name: 'Rock FM', iconURL: 'https://cdn-profiles.tunein.com/s67006/images/logoq.png'})
        .setDescription(`Artista: ${getartist}`)
        .setFooter({text: `El nombre no cambia al instante, aparece 10 segundos después de terminar una canción.`})
    const guild = await client.guilds.fetch("928018226330337280");
    const channel = await guild.channels.fetch("1008730592835281009");
    const edit = await (channel as TextChannel).messages.fetch("1008778179252596736")
    await edit.edit({content: '', embeds: [embed]})
}

function nowPlayingInterval() {
setInterval(nowPlayingRadio, 4000)
}

nowPlayingInterval()
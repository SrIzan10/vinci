import { ActionRow, ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, ButtonStyle, CacheType, CommandInteractionOptionResolver, CommandInteractionResolvedData, EmbedBuilder } from "discord.js";
import axios from "axios";
import { Context } from "@sern/handler";

/**
    Search Wikipedia for a given input string in the specified language using the Wikipedia API.
    @async
    @function searchWikipedia
    @param {string} lang - The language code for the Wikipedia language edition to search in.
    @param {AutocompleteInteraction} autocomplete - The autocomplete interaction object containing the input to search for.
    @returns {Promise<SearchWikipediaObject[]>} - A promise that resolves with an array of search results.
**/
export async function searchWikipedia(lang: string, autocomplete: AutocompleteInteraction<CacheType>) {
    const input = autocomplete.options.getFocused()
    if (!input) {
        return [{ ns: 0, title: 'Empieza a escribir para buscar!', pageid: 0, size: 0, wordcount: 0, snippet: 0, timestamp: 0 }] as unknown as SearchWikipediaObject[]
    }
    const request = await axios.get(`https://${lang}.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${input}`)
    return request.data.query.search as SearchWikipediaObject[]
}

export async function getWikipedia(lang: string, ctx: Context, options: CommandInteractionOptionResolver<CacheType>) {
    const pageid = options.getString((lang === 'es') ? 'busqueda' : 'search', true)
    if (Number.isNaN(Number(pageid))) return ctx.reply({ content: 'Elige en el autocompletado el artículo.', ephemeral: true })
    const request = await axios.get(`https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageid}&format=json`)
    const firstParagraph = (request.data.query.pages[pageid]).extract.split('\n\n')[0] as string
    const title = (request.data.query.pages[pageid]).title as string

    const canonicalArticleURL = await axios.get(`https://${lang}.wikipedia.org/w/api.php?action=query&prop=info&pageids=${pageid}&inprop=url&format=json`).then(res => {  
        return res.data.query.pages[pageid].canonicalurl as string
    })

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor('Random')
        .setAuthor({ name: ctx.user.username, iconURL: ctx.user.displayAvatarURL() })
        .setDescription(`${firstParagraph.slice(0, 500)}...`)
        .setFooter({ text: `Resultado de Wikipedia en ${(lang === 'es') ? 'español' : 'inglés'}`, iconURL: 'https://i.imgur.com/pcpfc8i.png' })
    const button = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('URL al artículo')
                .setURL(canonicalArticleURL)
                .setStyle(ButtonStyle.Link)
        )
    
    await ctx.reply({ embeds: [embed], components: [button] })
}

export interface SearchWikipediaObject {
    ns: number
    title: string
    pageid: number
    size: number
    wordcount: number
    snippet: string
    timestamp: string
}
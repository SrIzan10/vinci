import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, bold, codeBlock, EmbedBuilder, inlineCode } from 'discord.js';
import { publish } from '../../plugins/publish.js';
import fs from 'node:fs/promises'
import { ICFile } from '../../util/infinitecraft/decompress.js';
import Finder from '../../util/infinitecraft/finder.js';

const recipeFile = JSON.parse(await fs.readFile('./util/infinitecraft/recipes.json', 'utf-8')) as ICFile;

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish()],
    description: 'Descifra con un algoritmo cómo llegar a la receta de un objeto en InfiniteCraft',
    options: [
        {
            name: 'objeto',
            description: 'El objeto que quieres descifrar',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
            command: {
                onEvent: [],
                async execute(ctx) {
                    const input = ctx.options.getFocused();
					const choices = recipeFile.items
                        .filter(item => item.toLowerCase().startsWith(input.toLowerCase()))
                        .slice(0, 25)
                    if (choices.length === 0) return ctx.respond([{ name: 'No se encontraron resultados', value: 'SSError' }]);
                    if (input.length === 0) return ctx.respond([{ name: 'Empieza a escribir', value: 'SSError' }]);
					await ctx.respond(
						choices.map(choice => {
							return ({ name: choice, value: choice })
						})
					)
                },
            }
        }
    ],
    execute: async (ctx, [, options]) => {
        await ctx.interaction.deferReply()
        const object = options.getString('objeto', true)
        if (object === 'SSError') return ctx.reply({
            content: 'Has escogido el mensaje de error 💀',
            ephemeral: true
        });
        if (!recipeFile.items.includes(options.getString('objeto', true))) return ctx.reply({
            content: 'No se encontró el objeto. Asegúrate de escogerlo del autocompletado.',
            ephemeral: true
        });

        let processed = 0
        let timesBacked = 0
        const infinitePath = new Finder((progress) => {
            switch (progress.phase) {
                case 0:
                    processed = progress.current
                    break;
                case 1:
                    timesBacked = timesBacked + 1
                    break;
            }
        })

        const interval = setInterval(() => {
            ctx.interaction.editReply({
                content: `Procesando...\n${inlineCode(processed.toString())} recetas procesadas, ${inlineCode(timesBacked.toString())} veces retrocedido.`,
            })
        }, 1250)
        const initialTime = performance.now()
        const path = await infinitePath.findItem(object)
        const finalTime = performance.now()
        clearInterval(interval)
        if (path.length === 0) return ctx.interaction.editReply({
            content: 'No se encontró la receta de este objeto.'
        });

        const recipe = path.map(({ first, second, result }) => `${first} + ${second} = ${result}`).join('\n')
        if (recipe.length >= 4096) {
            var paste = await fetch('https://fb.srizan.dev/paste', {
                method: 'POST',
                body: recipe
            }).then(async res => await res.text())
        }
        const embed = new EmbedBuilder()
            .setTitle(`Receta de ${object.toLowerCase()}`)
            .setColor('Green')
            .setDescription(paste ? `https://fb.srizan.dev/${paste}` : codeBlock(recipe))
            .setFooter({ text: 'Ya que se usa un algoritmo, puede o no ser la ruta más rápida para llegar al ítem' })
        return ctx.interaction.editReply({
            embeds: [embed],
            content: `Por fin encontrado! La búsqueda tomó ${bold(((finalTime - initialTime) / 1000).toFixed(2))} segundos.`
        })
    },
});
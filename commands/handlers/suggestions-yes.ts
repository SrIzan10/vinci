import { commandModule, CommandType } from "@sern/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType } from "discord.js";
import db from "../../schemas/suggestions.js";

export default commandModule({
    type: CommandType.Button,
    async execute(interaction) {
        const convertToNumber = Number(interaction.component.label!)
        const upvotebuttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
                .setCustomId('suggestions-yes')
                .setEmoji('✅')
                .setLabel((convertToNumber + 1).toString())
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder(interaction.message!.components[0].components[1].data)
        )
        const row2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder(interaction.message!.components[1].components[0].data),
            new ButtonBuilder(interaction.message!.components[1].components[1].data)
        )
        await db.exists({msgid: interaction.message.id, userid: interaction.user.id}, async (err, doc) => {
            if (err) throw err
            if (doc) {
                await interaction.reply({content: 'Ya has hecho upvote/downvote, no puedes hacerlo de nuevo.', ephemeral: true})
            } else {
                const addToDB = new db({
                    msgid: interaction.message.id,
                    userid: interaction.user.id,
                    upordown: 1
                })
                await addToDB.save()
                await interaction.message.edit({components: [upvotebuttons, row2]})
                await interaction.deferUpdate()
            }
        })
    }
})
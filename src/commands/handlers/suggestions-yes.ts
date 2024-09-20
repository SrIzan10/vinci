import { commandModule, CommandType } from "@sern/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonComponentData, ButtonStyle } from "discord.js";
import db from "../../schemas/suggestions.js";

export default commandModule({
    type: CommandType.Button,
    async execute(interaction) {
        const convertToNumber = Number((interaction.component as ButtonComponent).label!)
        const row2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder(interaction.message!.components[1].components[0].data as ButtonComponentData),
            new ButtonBuilder(interaction.message!.components[1].components[1].data as ButtonComponentData)
        )
        if (await db.exists({msgid: interaction.message.id, userid: interaction.user.id, upordown: -1})) {
            await db.findOneAndUpdate({msgid: interaction.message.id, userid: interaction.user.id, upordown: -1}, {upordown: 1}, {returnOriginal: false})
            // god forbid I use any! I'm literally done with trying to solve this dude
            const upvoteLabel = JSON.stringify(interaction.message!.components[0].components[1].data) as string
            const downvotebuttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder()
                    .setCustomId('suggestions-yes')
                    .setEmoji('✅')
                    .setLabel((convertToNumber + 1).toString())
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder(interaction.message!.components[0].components[1].data as ButtonComponentData)
                    .setLabel((Number(JSON.parse(upvoteLabel).label) - 1).toString()),
            )
            await interaction.message.edit({components: [downvotebuttons, row2]})
            await interaction.deferUpdate()
        } else if (await db.exists({msgid: interaction.message.id, userid: interaction.user.id, upordown: 1})) {
            return await interaction.reply({content: 'Ya has hecho upvote.', ephemeral: true})
        } else {
            const downvotebuttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder()
                    .setCustomId('suggestions-yes')
                    .setEmoji('✅')
                    .setLabel((convertToNumber + 1).toString())
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder(interaction.message!.components[0].components[1].data as ButtonComponentData)
            )

            const addToDB = new db({
                msgid: interaction.message.id,
                userid: interaction.user.id,
                upordown: 1
            })
            await addToDB.save()
            await interaction.message.edit({components: [downvotebuttons, row2]})
            await interaction.deferUpdate()
        }
    }
})
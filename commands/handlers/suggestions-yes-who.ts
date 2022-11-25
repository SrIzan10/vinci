import { commandModule, CommandType } from "@sern/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType } from "discord.js";
import db from "../../schemas/suggestions.js";

export default commandModule({
    type: CommandType.Button,
    async execute(interaction) {
        let finalarray
        await interaction.deferReply({ephemeral: true})
        const findeverything = await db.find({msgid: interaction.message.id, upordown: 1})
        const array = findeverything.filter(message => message.msgid)
        const fetchedids = await Promise.all(array.map(async (user) => {
            return interaction.client.users.fetch(user.userid)
        }))
        if (fetchedids.length === 0) {
            finalarray = 'Nadie, de momento'
        } else {
            finalarray = fetchedids.join(', ')
        }
        await interaction.editReply({
            content: `Gente que ha hecho upvote:\n${finalarray}`,
            allowedMentions: {repliedUser: false}
        })
    }
})
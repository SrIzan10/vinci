import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
    type: CommandType.Button,
    execute: async (ctx) => {
        await ctx.deferReply({ ephemeral: true })
        const getUserID = await ctx.client.users.fetch((ctx.message.embeds[0].footer!.text).replace('Discord ID: ', ''))
        
        await getUserID.send({
            content: `Tu solicitud de entrada al servidor ha sido aceptada correctamente!\nYa puedes entrar al servidor con la IP \`minecraft.maraturing.com\``
        }).catch(async () => {
            await ctx.editReply({
                content: `No se ha podido enviar un DM a ${getUserID} <:Sadge:1015764348385382451>`,
            })
        }).then(async () => {
            await ctx.editReply({
                content: `Se ha podido enviar un DM a ${getUserID} correctamente! <:Pog:1030169609178976346>`
            })
        })
    },
});
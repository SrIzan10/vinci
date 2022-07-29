const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../src/plugins/publish";
import { eco } from "../index"
const { EmbedBuilder } = require("discord.js")

export default commandModule({
	name: 'leaderboard',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298'])],
	description: 'ECONOMIA: Mira las personas que tienen más vi$!',
	//alias : [],
	execute: async (ctx, args) => {
        let lb = await eco.leaderboard(false, 10);
        const embed = new EmbedBuilder()
        .setAuthor("Tabla")
        .setColor("BLURPLE");
        lb.forEach(u => {
            embed.addField(`${u.position}. ${ctx.client.users.cache.get(u.user).tag}`, `Dinero: ${u.money}vi$ 💸`);
        });
        await ctx.reply(embed);
	},
});
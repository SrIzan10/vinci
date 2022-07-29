const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../src/plugins/publish";
import { eco } from "../index"

export default commandModule({
	name: 'bal',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298'])],
	description: 'ECONOMIA: Mira el money money que tienes.',
	//alias : [],
	execute: async (ctx, args) => {
        let money = await eco.fetchMoney(ctx.message.author.id);
        ctx.reply(`Tienes ${money}vi$.`);
	},
});
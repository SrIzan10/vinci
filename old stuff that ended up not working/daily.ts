const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../src/plugins/publish";
import { eco } from "../index"

export default commandModule({
	name: 'daily',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298'])],
	description: 'ECONOMIA: Consigue tu dinero diario.',
	//alias : [],
	execute: async (ctx, args) => {
		let add = eco.daily(ctx.author.id, false, 500);
        if (add.cooldown) return ctx.reply(`Ya has conseguido tus dailys. Vuelve en ${add.time.days} días, ${add.time.hours} horas, ${add.time.minutes} minutos y ${add.time.seconds} segundos.`);
        ctx.reply(`has conseguido ${add.amount}vi$ y tienes ${add.money}vi$ en total.`);
	},
});
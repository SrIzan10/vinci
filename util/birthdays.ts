import dayjs from "dayjs";
import { Client, TextChannel } from "discord.js";
import db from "../schemas/birthdays.js";

export default async function birthdays(client: Client) {
db.find({}, (err, user) => {
	if (err) throw err
	user.map(async user => {
		const finduser = await db.findOne({ id: user.id });
		async function saveit() {
				finduser!.alreadysent = false
				await finduser!.save()
		}
		if (finduser!.date === dayjs().format("D-M")) {} else return
		if (finduser!.alreadysent === true && dayjs().format('D-M') !== finduser!.date) return saveit()
		if (finduser!.alreadysent === true) return
		const sendtochannel = (await (
			await client.guilds.fetch(process.env.GUILDID!)
		).channels.fetch(process.env.BIRTHDAYS_CHANNEL!)) as TextChannel;
		const message = await sendtochannel.send({ content: `Hola <@&1039613683422208020>!\nHoy es el cumpleaños de <@${finduser!.id}> 🎉🎉🎉\nMuchas felicidades!` })
		message.react('🎉')
		message.react('<:Pog:1030169609178976346>')
		finduser!.alreadysent = true
		await finduser?.save()
	})
})
}

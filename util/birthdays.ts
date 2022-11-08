import dayjs from "dayjs";
import { Client, TextChannel } from "discord.js";
import db from "../schemas/birthdays.js";

export default async function birthdays(client: Client) {
	const fetchallusers = await db.find();
	const filtered = fetchallusers.map((user) => user.id);
	for (const user of filtered) {
		const finduser = await db.findOne({ id: user });
		async function saveit() {
				finduser!.alreadysent = false
				await finduser!.save() 
		}
		if (finduser!.date === dayjs().format("D-M")) {} else return
		if (finduser!.alreadysent === true && dayjs().format('D-M') !== finduser!.date) return saveit()
		if (finduser!.alreadysent === true && dayjs().format('D-M') === finduser!.date) return
		const sendtochannel = (await (
			await client.guilds.fetch("1000400148289036298")
		).channels.fetch("1037760113219469403")) as TextChannel;
		const message = await sendtochannel.send({ content: `Es el cumpleaños de <@${finduser!.id}> 🎉🎉🎉\nMuchas felicidades!` })
		message.react('🎉')
		message.react('<:Pog:1030169609178976346>')
		finduser!.alreadysent = true
		await finduser?.save()
	}
}

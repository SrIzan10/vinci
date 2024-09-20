//@ts-nocheck
/**
 * @plugin
 * Disables a command entirely, for whatever reasons you may need.
 *
 * @author @jacoobes [<@182326315813306368>]
 * @author @Peter-MJ-Parker [<@371759410009341952>]
 * @version 2.1.0
 * @example
 * ```ts
 * import { disable } from "../plugins/disable";
 * import { commandModule } from "@sern/handler";
 * export default commandModule({
 *  plugins: [ disable() ],
 *  execute: (ctx) => {
 * 		//your code here
 *  }
 * })
 * ```
 * @end
 */
import { CommandType, CommandControlPlugin, controller } from "@sern/handler";
import { InteractionReplyOptions, MessageReplyOptions } from "discord.js";

export function disable(
	onFail?:
		| string
		| Omit<InteractionReplyOptions, "fetchReply">
		| MessageReplyOptions
) {
	return CommandControlPlugin<CommandType.Both>(async (ctx, [args]) => {
		if (onFail !== undefined) {
			switch (args) {
				case "text":
					try {
						//reply to text command
						const msg = await ctx.reply(onFail);
						setTimeout(() => {
							//deletes the bots reply to the user
							msg.delete();
							//deletes the original authors message (text command).
							ctx.message.delete();
							//waits 5 seconds before deleting messages
						}, 5000);
					} catch (error) {
						console.log(
							"Could not delete disabled response due to: " +
								error
						);
					}

					break;

				case "slash":
					//response to say the command is disabled with users response.
					let reply = await ctx.reply(onFail);
					try {
						setTimeout(async () => {
							await reply.delete();
						}, 5000);
					} catch (error) {
						console.log(
							"Could not delete disabled response due to it being ephemeral."
						);
					}
					break;

				default:
					break;
			}
		}
		//this function tells the bot to reply to an interaction so it doesn't seem like it fails (in case there is no onFail message).
		if (onFail === undefined && args === "slash") {
			onFail = "This command is disabled.";
			await ctx.reply({ content: onFail, ephemeral: true });
		}
		//stop the command from running
		return controller.stop();
	});
}

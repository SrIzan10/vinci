// @ts-nocheck
/**
 * @author: @EvolutionX-10
 * @version: 1.0.0
 * @description: This is OwnerOnly plugin, it allows only bot owners to run the command, like eval.
 * @license: MIT
 * @example:
 * ```ts
 * import { OwnerOnly } from "../path/to/your/plugin/folder";
 * import { sernModule, CommandType } from "@sern/handler";
 * export default sernModule<CommandType.Slash>([OwnerOnly()], {
 * // your code
 * })
 * ```
 */

import { CommandType, EventPlugin, PluginType } from "@sern/handler";
const ownerIDs = ["464397024247152640", "703974042700611634"]; //! Fill your ID
export function ownerOnly(): EventPlugin<CommandType.Both> {
	return {
		type: PluginType.Event,
		description: "Allows only bot owner to run command",
		async execute(event, controller) {
			const [ctx] = event;
			if (ownerIDs.includes(ctx.user.id)) return controller.next();
			//* If you want to reply when the command fails due to user not being owner, you can use following
			await ctx.reply("❌: Sólo los administradores pueden correr este comando.");
			return controller.stop(); //! Important: It stops the execution of command!
		},
	};
}

// @ts-nocheck
/**
 * This is OwnerOnly plugin, it allows only bot owners to run the command, like eval.
 *
 * @author @EvolutionX-10 [<@697795666373640213>]
 * @version 1.0.0
 * @example
 * ```ts
 * import { ownerOnly } from "../plugins/ownerOnly";
 * import { commandModule } from "@sern/handler";
 * export default commandModule({
 *  plugins: [ ownerOnly() ],
 *  execute: (ctx) => {
 * 		//your code here
 *  }
 * })
 * ```
 */

import { CommandType, CommandControlPlugin, controller } from "@sern/handler";
const ownerIDs = ['703974042700611634']; //! Fill your ID
export function srIzanOnly() {
	return CommandControlPlugin<CommandType.Both>((ctx, args) => {
		if (ownerIDs.includes(ctx.user.id)) return controller.next();
		//* If you want to reply when the command fails due to user not being owner, you can use following
		ctx.reply("**ERROR**: Sólo Sr Izan puede correr este comando.");
		return controller.stop(); //! Important: It stops the execution of command!
	});
}

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
const ownerIDs = ["464397024247152640", "703974042700611634", '252679156465139722', '370918560446545922', '375984365181599744', '785836117630910485', '368107342140801025']; //! Fill your ID
export function ownerOnly() {
	return CommandControlPlugin<CommandType.Both>((ctx, args) => {
		if (ownerIDs.includes(ctx.user.id)) return controller.next();
		//* If you want to reply when the command fails due to user not being owner, you can use following
		ctx.reply("**ERROR**: Sólo los administradores pueden correr este comando.");
		return controller.stop(); //! Important: It stops the execution of command!
	});
}

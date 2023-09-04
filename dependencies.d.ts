import { SernEmitter, Logging, CoreModuleStore, ModuleManager, ErrorHandling, CoreDependencies, Singleton } from '@sern/handler'
import { Client } from 'discord.js'

declare global {
   interface Dependencies extends CoreDependencies {
        '@sern/client': Singleton<Client>
   }
}

export {}
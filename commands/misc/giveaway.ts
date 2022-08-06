const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly";
const ms = require("ms")
import { db } from "../../index"
import { ApplicationCommandOptionType } from "discord.js";
const { GiveawaysManager } = require('discord-giveaways');

export default commandModule({
	name: 'sorteo',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298']), ownerOnly()],
	description: 'ADMIN: Crea un sorteo.',
    options: [
        {
            name: "comenzar",
            description: "Comienza el sorteo.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "duracion",
                    description: "Cuánto durará el sorteo. (1m, 1h, 1d)",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "ganador",
                    description: "Escribe el número de ganador(es) del sorteo.",
                    type: ApplicationCommandOptionType.Number,
                    required: true
                },
                {
                    name: "premio",
                    description: "Escribe el nombre del premio.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "canal",
                    description: "Escribe el nombre del canal de texto para enviar el mensaje.",
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }
            ]
        },
        {
            name: "acciones",
            description: "Haz algo sobre un sorteo existente.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "opciones",
                    description: "Selecciona un opción",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "acabar",
                            value: "acabar"
                        },
                        {
                            name: "pausar",
                            value: "pausar"
                        },
                        {
                            name: "reanudar",
                            value: "reanudar"
                        },
                        {
                            name: "re-elegir",
                            value: "re-elegir"
                        },
                        {
                            name: "eliminar",
                            value: "eliminar"
                        }
                    ]
                }
            ]
        }
    ],
	//alias : [],
	execute: async (ctx, options) => {
		
	},
});
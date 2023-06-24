import { registerCommand as registercommand } from "@vendetta/commands"
import { ApplicationCommandType, ApplicationCommandInputType } from "../../../ApplicationCommandTypes"
import { storage as settings } from "@vendetta/plugin"

interface Command {
    name: string
    description: string
    options?: ApplicationCommandOption[]
    id?: string
    execute: (args: any[], ctx: CommandContext) => CommandResult | void | Promise<CommandResult> | Promise<void>
}

export const registerCommand = (data: Command) => registercommand({
    displayName: data.name,
    displayDescription: data.description,
    applicationId: "-1",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    options: data.options ?? [],
    ...data
})

export const isNotSetup = () => !settings.clientID || isNaN(parseFloat(settings.clientID)) || !settings.clientSecret
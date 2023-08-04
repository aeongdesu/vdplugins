import { registerCommand } from "@vendetta/commands"
import { ApplicationCommandType, ApplicationCommandInputType, ApplicationCommandOptionType } from "../../../ApplicationCommandTypes"
import execute from "./execute"

const unregister = registerCommand({
    name: "voicemessage",
    displayName: "voicemessage",
    description: "Uploads an audio file as a voice message",
    displayDescription: "Uploads an audio file as a voice message",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    options: [{
        name: "file",
        displayName: "file",
        description: "Audio file to upload",
        displayDescription: "Audio file to upload",
        type: ApplicationCommandOptionType.ATTACHMENT as number,
        required: true
    }],
    execute
})

export const onUnload = () => unregister()
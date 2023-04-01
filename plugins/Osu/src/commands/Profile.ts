import { registerCommand } from "@vendetta/commands"
import { settings, sendBotMessage } from "../utils"

export default registerCommand({
    name: "osu-profile",
    displayName: "osu-profile",
    description: "Display statistics of a user",
    displayDescription: "Display statistics of a user",
    options: [{
        name: "username",
        displayName: "username",
        description: "Specify a username, ID, or URL of the player",
        displayDescription: "Specify a username, ID, or URL of the player",
        required: false,
        type: 3
    }],
    applicationId: "",
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
        if (!settings.clientID || !Number.isInteger(settings.clientID) || !settings.clientSecret) return sendBotMessage(ctx.channel.id, "Please set apiv2 configuration in plugin settings.")
    }
})
import { registerCommand } from "@vendetta/commands"
import { settings, sendBotMessage, getOption } from "../utils"
import { getRecent } from "../osuapi"

export default registerCommand({
    name: "osu-recent",
    displayName: "osu-recent",
    description: "Get the recent score(s) of a user",
    displayDescription: "Get the recent score(s) of a user",
    options: [{
        name: "user",
        displayName: "user",
        description: "Specify a username, ID, or URL",
        displayDescription: "Specify a username, ID, or URL",
        required: false,
        type: 3
    }],
    applicationId: "",
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
        if (!settings.clientID || isNaN(parseFloat(settings.clientID)) || !settings.clientSecret) return sendBotMessage(ctx.channel.id, "Please set apiv2 configuration in plugin settings.")
        const recent = await getRecent(args[0].value)
        if (!recent) return sendBotMessage(ctx.channel.id, "Invalid User / No recent scores")

        return sendBotMessage(ctx.channel.id, JSON.stringify(recent))
    }
})
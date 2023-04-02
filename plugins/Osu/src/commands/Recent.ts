import { registerCommand } from "@vendetta/commands"
import { settings, sendBotMessage } from "../utils"
import { getBeatmap } from "../osuapi"

export default registerCommand({
    name: "osu-recent",
    displayName: "osu-recent",
    description: "Sends an info message about the specified beatmap",
    displayDescription: "Sends an info message about the specified beatmap",
    options: [{
        name: "profile",
        displayName: "profile",
        description: "Specify a username, ID, or URL of the player",
        displayDescription: "Specify a username, ID, or URL of the player",
        required: false,
        type: 3
    }],
    applicationId: "",
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
        if (!settings.clientID || isNaN(parseFloat(settings.clientID)) || !settings.clientSecret) return sendBotMessage(ctx.channel.id, "Please set apiv2 configuration in plugin settings.")
        const beatmap = await getBeatmap(args[0].value)
        if (!beatmap) return sendBotMessage(ctx.channel.id, "Invalid Beatmap.") 

        return sendBotMessage(ctx.channel.id, `${beatmap.status} | ${beatmap.title} - ${beatmap.version}`)
    }
})
import { registerCommand } from "@vendetta/commands"
import { settings, sendBotMessage } from "../utils"
import { getBeatmap } from "../osuapi"

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
        const beatmap = await getBeatmap(args[0].value)
        if (!beatmap) return sendBotMessage(ctx.channel.id, "Invalid Beatmap.")

        return sendBotMessage(ctx.channel.id, `${beatmap.status} | ${beatmap.title} - ${beatmap.version}`)
    }
})
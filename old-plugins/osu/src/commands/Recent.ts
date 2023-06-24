import { registerCommand } from "@vendetta/commands"
import { settings, sendBotMessage, getOption, nicething } from "../utils"
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
        const recent = await getRecent(getOption(args, "user"))
        if (!recent) return sendBotMessage(ctx.channel.id, "Invalid User / No recent scores")
        // todo: not only first recent
        const content = [
            `> ${recent[0].user.country_code} | ${recent[0].user.username}`,
            `    <${recent[0].passed ? `https://osu.ppy.sh/scores/osu/${recent[0].id}` : recent[0].beatmap.url}>`,
            `> ${recent[0].beatmapset.artist} - ${recent[0].beatmapset.title} [${recent[0].beatmap.version}] [${recent[0].beatmap.difficulty_rating}]`,
            `> **_${recent[0].rank}_   ${recent[0].mods.length > 0 ? `+${recent[0].mods.join("")} ` : ""}`
                +   `${nicething(recent[0].score)}   (${Number(recent[0].accuracy * 100).toFixed(2)}%)   <t:${+new Date(recent[0].created_at) / 1000}:R>**`,
            `> [${recent[0].max_combo}x]`,
            `> {${recent[0].statistics.count_300}/${recent[0].statistics.count_100}/${recent[0].statistics.count_50}/${recent[0].statistics.count_miss}}`
        ]
        return sendBotMessage(ctx.channel.id, content.join("\n"))
    }
})
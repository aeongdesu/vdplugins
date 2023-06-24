import { registerCommand } from "@vendetta/commands"
import { settings, sendBotMessage } from "../utils"
import { getUser } from "../osuapi"
import { nicething, getOption } from "../utils"

export default registerCommand({
    name: "osu-profile",
    displayName: "osu-profile",
    description: "Display statistics of a user",
    displayDescription: "Display statistics of a user",
    options: [{
        name: "user",
        displayName: "user",
        description: "Specify a username, ID, or URL",
        displayDescription: "Specify a username, ID, or URL",
        required: false,
        type: 3
    },
    {
        name: "send",
        displayName: "send",
        description: "Whether to send the result",
        displayDescription: "Whether to send the result",
        required: false,
        type: 5
    }],
    applicationId: "",
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
        if (!settings.clientID || isNaN(parseFloat(settings.clientID)) || !settings.clientSecret) return sendBotMessage(ctx.channel.id, "Please set apiv2 configuration in plugin settings.")
        const user = await getUser(getOption(args, "user"))
        if (!user) return sendBotMessage(ctx.channel.id, "Invalid User.")
        let content: Array<string>

        if (user.bot || user.deleted || !user.active) content = [
            `> ${user.username}: https://osu.ppy.sh/users/${user.id} ${user.deleted ? "\*Deleted User\*" : user.bot ? "\*Bot\*" : !user.active ? "\*Inactive User\*" : ""}`,
        ]
        else content = [
            `> ${user.username}: ${user.pp}pp (#${user.rank} ${user.country_code}${user.country_rank})`,
            `    <https://osu.ppy.sh/users/${user.id}>\n`,
            `> Rank Peak: \`#${nicething(user.rank_highest.rank)}\` on <t:${+new Date(user.rank_highest.updated_at) / 1000}:D>`,
            `> Accuracy: \`${user.accuracy}%\` • Level: \`${user.level.current}.${user.level.progress}%\``,
            `> Playcount: \`${user.playcount}\` (\`${user.playtime} hrs\`)`,
            `> Ranks: **SSH** \`${user.grades.ssh}\` **SS** \`${user.grades.ss}\` **SH** \`${user.grades.sh}\` **S** \`${user.grades.s}\` **A** \`${user.grades.a}\``,
            `> Joined osu! <t:${user.join_date}:f>`
        ]
        if (getOption(args, "send") === true) return { content: content.join("\n") }
        else return sendBotMessage(ctx.channel.id, content.join("\n"))
    }
})
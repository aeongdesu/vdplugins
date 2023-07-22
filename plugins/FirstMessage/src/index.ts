import { registerCommand } from "@vendetta/commands"
import { findByProps } from "@vendetta/metro"
import { url } from "@vendetta/metro/common"
import { ApplicationCommandType, ApplicationCommandInputType, ApplicationCommandOptionType } from "../../../ApplicationCommandTypes"

const { sendBotMessage } = findByProps("sendBotMessage")
const APIUtils = findByProps("getAPIBaseURL", "get")
let commands = []

export const onLoad = () => {
    commands.push(registerCommand({
        name: "firstmessage",
        displayName: "firstmessage",
        description: "Tired of scrolling to first message?",
        displayDescription: "Tired of scrolling to first message?",
        type: ApplicationCommandType.CHAT as number,
        inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
        applicationId: "-1",
        options: [{
            name: "user",
            displayName: "user",
            description: "Target user to get their first message in this server/dm",
            displayDescription: "Target user to get their first message in this server/dm",
            type: ApplicationCommandOptionType.USER as number,
            required: false
        }, {
            name: "channel",
            displayName: "channel",
            description: "Target channel to get first message of",
            displayDescription: "Target channel to get first message of",
            type: ApplicationCommandOptionType.CHANNEL as number,
            required: false
        }, {
            name: "send",
            displayName: "send",
            description: "Whether to send the resulting url",
            displayDescription: "Whether to send the resulting url",
            type: ApplicationCommandOptionType.BOOLEAN as number,
            required: false
        }],
        async execute(args, ctx) {
            const user = args.find((o: any) => o.name === "user")?.value as number
            const channel = args.find((o: any) => o.name === "channel")?.value as number
            const send = args.find((o: any) => o.name === "send")?.value

            const guildId = ctx.guild?.id
            const channelId = ctx.channel.id
            const isDM = ctx.channel.type === 1

            let result = "https://discord.com/channels/"

            if (!user && !channel) {
                if (isDM) {
                    const message = await getFirstDMMessage(channelId)
                    result += `@me/${channelId}/${message.id}`
                } else {
                    const message = await getFirstGuildMessage(guildId)
                    result += `${guildId}/${message.channel_id}/${message.id}`
                }
            }
            else if (user) {
                if (isDM) {
                    const message = await getFirstDMMessage(channelId, user)
                    result += `@me/${channelId}/${message.id}`
                } else {
                    const message = await getFirstGuildMessage(guildId, user)
                    result += `${guildId}/${message.channel_id}/${message.id}`
                }
            }
            else if (channel) {
                if (isDM) return sendBotMessage(channelId, "This combination cannot be used in dms!")
                const message = await getFirstGuildMessage(guildId, null, channel)
                result += `${guildId}/${channel}/${message.id}`
            }
            else { // both
                if (isDM) return sendBotMessage(channelId, "This combination cannot be used in dms!")
                const message = await getFirstGuildMessage(guildId, user, channel)
                result += `${guildId}/${channel}/${message.id}`
            }

            if (send) return { content: result }
            return url.openDeeplink(result)
        }
    }))
}

export const onUnload = () => {
    for (const unregisterCommands of commands) unregisterCommands()
}

const getFirstGuildMessage = async (guildId: number, userId?: number, channelId?: number) => {
    const userParam = userId ? `&author_id=${userId}` : ""
    const channelParam = channelId ? `&channel_id=${channelId}` : ""
    const minIdParam = userId ? "" :`&min_id=0`
    return (await APIUtils.get({
        url: `/guilds/${guildId}/messages/search`,
        query: `include_nsfw=true${userParam}${channelParam}${minIdParam}&sort_by=timestamp&sort_order=asc&offset=0`
    })).body.messages[0][0]
}

const getFirstDMMessage = async (dmId: number, userId?: number) => {
    const userParam = userId ? `&author_id=${userId}` : ""
    const minIdParam = userId ? "" :`&min_id=0`
    return (await APIUtils.get({
        url: `/channels/${dmId}/messages/search`,
        query: `&sort_by=timestamp&sort_order=asc&offset=0${userParam}${minIdParam}`
    })).body.messages[0][0]
}
import { registerCommand } from "@vendetta/commands"
import { findByProps, findByStoreName } from "@vendetta/metro"
import { ApplicationCommandType, ApplicationCommandInputType, ApplicationCommandOptionType } from "../../../ApplicationCommandTypes"

const { sendBotMessage } = findByProps("sendBotMessage")
const APIUtils = findByProps("getAPIBaseURL", "get")
const ChannelStore = findByStoreName("ChannelStore")

let commands = []

export const onLoad = () => {
    commands.push(registerCommand({
        name: "firstmessage",
        displayName: "firstmessage",
        description: "Tired of scrolling to first message? (dm broken)",
        displayDescription: "Tired of scrolling to first message? (dm broken)",
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

            const guildId = ctx.guild.id
            const channelId = ctx.channel.id
            const isDM = ctx.channel.type ?? ChannelStore.getChannel(ChannelStore.getChannelId()).type === 1

            let result = "https://discord.com/channels/"

            if (!user && !channel) {
                if (isDM) {
                    const message = (await APIUtils.get({
                        url: `/channels/${channelId}/messages/search`,
                        query: `min_id=0&sort_by=timestamp&sort_order=asc&offset=0`
                    })).body.messages[0][0]
                    result += `@me/${channelId}/${message.id}`
                } else {
                    const message = await getGuildMessage(guildId, null, channelId)
                    result += `${guildId}/${channelId}/${message.id}`
                }
            }
            else if (user) {
                const message = await getGuildMessage(guildId, user)
                result += `${guildId}/${message.channel_id}/${message.id}`
            }
            else if (channel) {
                if (isDM) return sendBotMessage(channelId, "This combination cannot be used in dms!")
                const message = await getGuildMessage(guildId, null, channel)
                result += `${guildId}/${channel}/${message.id}`
            }
            else { // both
                if (isDM) return sendBotMessage(channelId, "This combination cannot be used in dms!")
                const message = await getGuildMessage(guildId, user, channel)
                result += `${guildId}/${channel}/${message.id}`
            }
            if (send) return { content: result }
            return sendBotMessage(channelId, result)
        }
    }))
}

export const onUnload = () => {
    for (const unregisterCommands of commands) unregisterCommands()
}

const getGuildMessage = async (guildId: number, userId?: number, channelId?: number) => {
    const userParam = userId ? `&author_id=${userId}` : ""
    const channelParam = channelId ? `&channel_id=${channelId}` : ""
    return (await APIUtils.get({
        url: `/guilds/${guildId}/messages/search`,
        query: `include_nsfw=true${userParam}${channelParam}&sort_by=timestamp&sort_order=asc&offset=0`
    })).body.messages[0][0]
}
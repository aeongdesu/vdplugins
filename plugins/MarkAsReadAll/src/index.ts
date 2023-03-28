import { findByStoreName, findByProps } from "@vendetta/metro"
import { FluxDispatcher } from "@vendetta/metro/common"
import { registerCommand } from "@vendetta/commands"

const ClydeUtils = findByProps("sendBotMessage")
const GuildStore = findByStoreName("GuildStore")
const GuildChannelStore = findByStoreName("GuildChannelStore")
const ReadStateStore = findByStoreName("ReadStateStore")

const unpatch = registerCommand({
    name: "markasreadall",
    displayName: "markasreadall",
    description: "read all server notifications",
    displayDescription: "read all server notifications",
    // @ts-ignore
    applicationId: -1,
    inputType: 1,
    type: 1,

    execute: (args, ctx) => {
        try {
            const channels: Array<any> = []

            Object.values(GuildStore.getGuilds()).forEach((guild: any) => {
                GuildChannelStore.getChannels(guild.id).SELECTABLE.forEach((c: { channel: { id: string } }) => {
                    if (!ReadStateStore.hasUnread(c.channel.id)) return

                    channels.push({
                        channelId: c.channel.id,
                        // messageId: c.channel?.lastMessageId,
                        messageId: ReadStateStore.lastMessageId(c.channel.id),
                        readStateType: 0
                    })
                })
            })

            FluxDispatcher.dispatch({
                type: "BULK_ACK",
                context: "APP",
                channels: channels
            })
            ClydeUtils.sendBotMessage(ctx.channel.id, "Done!")
        } catch {
            ClydeUtils.sendBotMessage(ctx.channel.id, "Failed to read all server notifications")
        }
    }
})
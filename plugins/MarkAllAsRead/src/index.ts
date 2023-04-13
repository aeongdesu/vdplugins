import { findByStoreName, findByProps } from "@vendetta/metro"
import { registerCommand } from "@vendetta/commands"
import { logger } from "@vendetta"
import { storage } from "@vendetta/plugin"

const ClydeUtils = findByProps("sendBotMessage")
const GuildStore = findByStoreName("GuildStore")
const GuildChannelStore = findByStoreName("GuildChannelStore")
const ReadStateStore = findByStoreName("ReadStateStore")
const { post } = findByProps("setRequestPatch").default
const { Endpoints } = findByProps("Endpoints")
const UserGuildSettingsStore = findByStoreName("UserGuildSettingsStore")

const unregisterCommand = registerCommand({
    name: "markallasread",
    displayName: "markallasread",
    description: "read all server notifications (up to 100)",
    displayDescription: "read all server notifications (up to 100 at time)",
    options: [],
    applicationId: "",
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
        try {
            if (new Date() < storage.timeout) return ClydeUtils.sendBotMessage(ctx.channel.id, "Please wait 10 seconds!")
            const channels: Array<any> = []

            Object.values(GuildStore.getGuilds()).forEach((guild: any) => {
                if (!UserGuildSettingsStore.isMuted(guild.id))
                    GuildChannelStore.getChannels(guild.id).SELECTABLE.forEach((c: { channel: { id: string } }) => {
                        if (!ReadStateStore.hasUnread(c.channel.id)) return

                        channels.push({
                            channel_id: c.channel.id,
                            message_id: ReadStateStore.lastMessageId(c.channel.id)
                        })
                    })
            })
            await post({
                url: Endpoints.BULK_ACK,
                body: {
                    "read_states": channels.slice(0, 100)
                }
            })
            storage.timeout = +new Date() + 10000 // 10 seconds cooldown
            return ClydeUtils.sendBotMessage(ctx.channel.id, "Done!")
        } catch (e) {
            logger.error(e)
            return ClydeUtils.sendBotMessage(ctx.channel.id, "Failed to read all server notifications!")
        }
    }
})

export const onUnload = () => unregisterCommand()
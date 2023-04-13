import { findByStoreName, findByProps } from "@vendetta/metro"
import { FluxDispatcher } from "@vendetta/metro/common"
import { registerCommand } from "@vendetta/commands"
import { logger } from "@vendetta"

const ClydeUtils = findByProps("sendBotMessage")
const GuildStore = findByStoreName("GuildStore")
const GuildChannelStore = findByStoreName("GuildChannelStore")
const ReadStateStore = findByStoreName("ReadStateStore")

const unregisterCommand = registerCommand({
    name: "markallasread",
    displayName: "markallasread",
    description: "read all server notifications",
    displayDescription: "read all server notifications",
    // @ts-ignore
    applicationId: -1,
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
        try {
            const channels: Array<any> = []

            Object.values(GuildStore.getGuilds()).forEach((guild: any) => {
                GuildChannelStore.getChannels(guild.id).SELECTABLE.forEach((c: { channel: { id: string } }) => {
                    if (!ReadStateStore.hasUnread(c.channel.id)) return

                    channels.push({
                        channel_id: c.channel.id,
                        message_id: ReadStateStore.lastMessageId(c.channel.id)
                    })
                })
            })

            await findByProps("setRequestPatch").default.post({
                url: findByProps("Endpoints").Endpoints.BULK_ACK,
                body: {
                    "read_states": channels.slice(0, 100)
                }
            })
            ClydeUtils.sendBotMessage(ctx.channel.id, "Done!")
        } catch (e) {
            logger.error(e)
            ClydeUtils.sendBotMessage(ctx.channel.id, "Failed to read all server notifications")
        }
    }
})

export const onUnload = () => unregisterCommand()
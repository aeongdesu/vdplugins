import { findByStoreName, findByProps } from "@vendetta/metro"
import { registerCommand } from "@vendetta/commands"
import { logger } from "@vendetta"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"

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
    description: "read all server notifications",
    displayDescription: "read all server notifications",
    options: [],
    applicationId: "",
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

            const readNOW = async (channels) => await post({
                url: Endpoints.BULK_ACK,
                body: {
                    "read_states": channels
                }
            })

            if (channels.length < 100) {
                await readNOW(channels)
                return ClydeUtils.sendBotMessage(ctx.channel.id, "Done!")
            } else {
                ClydeUtils.sendBotMessage(ctx.channel.id, "job queued, please do not switch accounts for now.")
                let index = 0
                const interval = setInterval(async () => {
                    await readNOW(channels.slice(index, index + 100))
                    index += 100
                    if (index >= channels.length) {
                        clearInterval(interval)
                        return showToast("Read all server notifications!", getAssetIDByName("check"))
                    }
                }, Math.floor(Math.random() * 2000) + 3000) // 3 ~ 5 seconds
            }
        } catch (e) {
            logger.error(e)
            return ClydeUtils.sendBotMessage(ctx.channel.id, "Failed to read all server notifications")
        }
    }
})

export const onUnload = () => unregisterCommand()
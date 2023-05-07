import { findByStoreName, findByProps } from "@vendetta/metro"
import { registerCommand } from "@vendetta/commands"
import { logger } from "@vendetta"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"

import { ApplicationCommandType, ApplicationCommandInputType } from "../../../ApplicationCommandTypes"

const ClydeUtils = findByProps("sendBotMessage")
const ReadStateStore = findByStoreName("ReadStateStore")
const { bulkAck } = findByProps("bulkAck")

const unregisterCommand = registerCommand({
    name: "markallasread",
    displayName: "markallasread",
    description: "read all server notifications",
    displayDescription: "read all server notifications",
    options: [],
    applicationId: "",
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    type: ApplicationCommandType.CHAT as number,

    execute: async (args, ctx) => {
        try {
            let channels: any[] = []
            const filter = ReadStateStore.getAllReadStates().filter(m => ReadStateStore.hasUnread(m.channelId)).map(m => ({ channelId: m.channelId, messageId: m._lastMessageId }))
            channels.push(...filter)

            bulkAck(channels)
            return showToast("Read all server notifications!", getAssetIDByName("check"))
        } catch (e) {
            logger.error(e)
            return ClydeUtils.sendBotMessage(ctx.channel.id, "Failed to read all server notifications")
        }
    }
})

export const onUnload = () => unregisterCommand()
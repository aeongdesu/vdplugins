import { findByName, findByStoreName } from "@vendetta/metro"
import { before } from "@vendetta/patcher"

const RowManager = findByName("RowManager")
const StickersStore = findByStoreName("StickersStore")

const stickerRegex = /https:\/\/(?:media\.discordapp\.net|discord\.com|cdn\.discordapp\.com)\/stickers\/(\d+)\.\w+/

export const PatchChat = before("generate", RowManager.prototype, ([data]) => {
    if (data.rowType !== 1) return
    if (data.message.stickers && data.message.stickerItems.length > 0) return
    let content = data.message.content as string
    if (!content?.length) return
    const match = content.match(stickerRegex)
    if (!match?.[1]) return
    const embeds = data.message.embeds
    for (let i = 0; i < embeds.length; i++) {
        const embed = embeds[i]
        if (embed.type === "image" && embed.url.match(stickerRegex)) {
            embeds.splice(i--, 1)
        }
    }
    const sticker = StickersStore.getStickerById(match[1])

    data.message.stickerItems = [{
        id: match[1],
        format_type: sticker?.format_type ?? 2, // 2 for animate
        name: sticker?.name ?? "realsticker"
    }]
    data.message.content = ""
})
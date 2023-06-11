import { before } from "@vendetta/patcher"
import { find, findByProps, findByStoreName } from "@vendetta/metro"
import { findInReactTree } from "@vendetta/utils"
import { Button } from "@vendetta/ui/components"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { clipboard } from "@vendetta/metro/common"

type Sticker = {
    id: string
    name: string
    tags: string
    type: number
    format_type: number
    description: string
    asset: string
    available: boolean
    guild_id: string
}

const GuildStore = findByStoreName("GuildStore")
const UserSettingsProtoStore = findByStoreName("UserSettingsProtoStore")
const { default: ActionSheet } = find(m => m.default?.render?.name === "ActionSheet")
const { hideActionSheet } = findByProps("hideActionSheet")
const { downloadMediaAsset } = findByProps("downloadMediaAsset")
const StickerUtils = findByProps("favoriteSticker", "unfavoriteSticker")

const style = { marginBottom: 10 }

const unpatch = before("render", ActionSheet, ([props]) => {
    const guh = findInReactTree(props, x => Array.isArray(x?.children))
    const sticker = findInReactTree(props, x => typeof x?.sticker === "object" && x?.sticker?.hasOwnProperty("guild_id"))?.sticker as Sticker
    const favoritedStickers = UserSettingsProtoStore.frecencyWithoutFetchingLatest.favoriteStickers.stickerIds as Array<string>
    if (!guh || !sticker) return
    const isFavorited = !!favoritedStickers.find((s: string) => s === sticker.id)
    const stickerUrl = `https://discord.com/stickers/${sticker.id}.png`
    // replaces HUGE get nitro button, wow!
    guh.children[1] = <>
        { Object.values(GuildStore.getGuilds()).find((x: any) => x.id === sticker.guild_id) &&
            <Button
                text={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                color={isFavorited ? "red" : "brand"}
                style={style}
                size="small"
                onPress={() => {
                    isFavorited ? StickerUtils.unfavoriteSticker(sticker.id) : StickerUtils.favoriteSticker(sticker.id)
                    // temp, idk how to make dynamically
                    hideActionSheet()
                    return showToast(isFavorited ? "Removed from Favorites" : "Added to Favorites", getAssetIDByName("Check"))
                }}
            />
        }
        <Button
            text="Copy ID to clipboard"
            color="brand"
            size="small"
            style={style}
            onPress={() => {
                clipboard.setString(sticker.id)
                hideActionSheet()
                return showToast(`Copied ${sticker.name}'s ID to clipboard`, getAssetIDByName("ic_copy_message_link"))
            }}
        />
        <Button
            text="Copy URL to clipboard"
            color="brand"
            size="small"
            style={style}
            onPress={() => {
                clipboard.setString(stickerUrl)
                hideActionSheet()
                return showToast(`Copied ${sticker.name}'s URL to clipboard`, getAssetIDByName("ic_copy_message_link"))
            }}
        />
        <Button
            text="Save image"
            color="brand"
            size="small"
            style={style}
            onPress={() => {
                downloadMediaAsset(stickerUrl, 0)
                hideActionSheet()
                return showToast(`Saved ${sticker.name}'s image`, getAssetIDByName("toast_image_saved"))
            }}
        />
    </>
})

export const onUnload = () => unpatch()

import { findByProps, findByStoreName } from "@vendetta/metro"
import { FluxDispatcher, React, ReactNative, i18n, stylesheet } from "@vendetta/metro/common"
import { before, after } from "@vendetta/patcher"
import { semanticColors } from "@vendetta/ui"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Forms } from "@vendetta/ui/components"
import { findInReactTree } from "@vendetta/utils"
import { settings } from ".."

import { DeepL } from "../api"
import { showToast } from "@vendetta/ui/toasts"
import { logger } from "@vendetta"

const LazyActionSheet = findByProps("openLazy", "hideActionSheet")
const ActionSheetRow = findByProps("ActionSheetRow")?.ActionSheetRow ?? Forms.FormRow // no icon if legacy
const MessageStore = findByStoreName("MessageStore")
const ChannelStore = findByStoreName("ChannelStore")

const styles = stylesheet.createThemedStyleSheet({
    iconComponent: {
        width: 24,
        height: 24,
        tintColor: semanticColors.INTERACTIVE_NORMAL
    }
})

let cachedData: object[] = []

export default () => before("openLazy", LazyActionSheet, ([component, key, msg]) => {
    const message = msg?.message
    if (key !== "MessageLongPressActionSheet" || !message) return
    component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
            React.useEffect(() => () => { unpatch() }, [])

            const buttons = findInReactTree(component, x => x?.[0]?.type?.name === "ButtonRow")
            if (!buttons) return
            const position = Math.max(buttons.findIndex((x: any) => x.props.message === i18n.Messages.MARK_UNREAD), 0)

            const originalMessage = MessageStore.getMessage(
                message.channel_id,
                message.id
            )
            if (!originalMessage?.content && !message.content) return

            const messageId = originalMessage?.id ?? message.id
            const messageContent = originalMessage?.content ?? message.content
            const existingCachedObject = cachedData.find((o: any) => Object.keys(o)[0] === messageId, "cache object")

            const translateType = existingCachedObject ? "Revert" : "Translate"
            const icon = translateType === "Translate" ? getAssetIDByName("ic_locale_24px") : getAssetIDByName("ic_highlight")

            const translate = async () => {
                try {
                    const target_lang = settings.target_lang
                    const isTranslated = translateType === "Translate"

                    const translate = await DeepL.translate(originalMessage.content, undefined, target_lang, !isTranslated)

                    FluxDispatcher.dispatch({
                        type: "MESSAGE_UPDATE",
                        message: {
                            ...originalMessage,
                            content: `${isTranslated ? translate.text : (existingCachedObject as object)[messageId]}`
                                + ` ${isTranslated ? `\`[${target_lang?.toLowerCase()}]\``
                                    : ""}`,
                            guild_id: ChannelStore.getChannel(
                                originalMessage.channel_id
                            ).guild_id,
                        },
                        log_edit: false
                    })

                    isTranslated
                        ? cachedData.unshift({ [messageId]: messageContent })
                        : cachedData = cachedData.filter((e: any) => e !== existingCachedObject, "cached data override")
                } catch (e) {
                    showToast("Failed to translate message. Please check Debug Logs for more info.", getAssetIDByName("Small"))
                    logger.error(e)
                } finally {
                    return LazyActionSheet.hideActionSheet()
                }
            }


            buttons.splice(position, 0, (
                <ActionSheetRow
                    label={`${translateType} Message`}
                    icon={
                        <ActionSheetRow.Icon
                            source={icon}
                            IconComponent={() => (
                                <ReactNative.Image
                                    resizeMode="cover"
                                    style={styles.iconComponent}
                                    source={icon}
                                />
                            )}
                        />
                    }
                    onPress={translate}
                />
            ))
        })
    })
})

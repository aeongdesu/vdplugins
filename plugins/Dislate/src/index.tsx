import { findByProps, findByName, findByStoreName } from "@vendetta/metro"
import { FluxDispatcher } from "@vendetta/metro/common"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Format, Translate, settings } from "./common"
import { Forms } from "@vendetta/ui/components"
import { before, after } from "@vendetta/patcher"

import LanguageNamesArray from "./translate/languages/names"
import ISO from "./translate/languages/iso"
import { commands, Settings } from "./components"
// temp
import { removePlugin } from "@vendetta/plugins"
import { plugin } from "@vendetta"

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const Icon = findByName("Icon")
const I18N = findByProps("Messages")

const MessageStore = findByStoreName("MessageStore")
const ChannelStore = findByStoreName("ChannelStore")

const { FormRow } = Forms

const LanguageNames = Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] })))
let cachedData: object[] = [{ "invalid_id": "rosie and sapphire sucks" }]

let patches = []

export default {
    onLoad: () => {
        // prevent
        if (!["581573474296791211", "757982547861962752", "548821619661864962"].find(k => k === findByProps("getCurrentUser").getCurrentUser()?.id)) return removePlugin(plugin.id)
        commands // recall to register command again

        // patch ActionSheet
        patches.push(before("openLazy", ActionSheet, (ctx) => {
            const [component, args, actionMessage] = ctx
            if (args !== "MessageLongPressActionSheet") return
            component.then(instance => {
                const unpatch = after("default", instance, (_, component) => {
                    let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children
                    const message = msgProps?.props?.message ?? actionMessage?.message
                    const guh = buttons?.findIndex((item: any) => item.props?.message === I18N.Messages.MARK_UNREAD)
                    if (!buttons || !message || !guh) return

                    const originalMessage = MessageStore.getMessage(
                        message.channel_id,
                        message.id
                    )
                    if (!originalMessage?.content && !message.content) return

                    const messageId = originalMessage.id ?? message.id
                    const messageContent = originalMessage.content ?? message.content
                    const existingCachedObject = cachedData.find((o: any) => Object.keys(o)[0] === messageId, "cache object")

                    let translateType = existingCachedObject ? "Revert" : "Translate"
                    buttons.splice(guh, 0, <FormRow
                        label={`${translateType} Message`}
                        leading={<Icon source={translateType === "Translate" ? getAssetIDByName("ic_locale_24px") : getAssetIDByName("ic_highlight")} />}
                        onPress={async () => {
                            const fromLanguage = settings.DislateLangFrom
                            const toLanguage = settings.DislateLangTo
                            const isTranslated = translateType === "Translate"
                            const translate = await Translate.string(originalMessage.content,
                                {
                                    fromLanguage: fromLanguage,
                                    toLanguage: toLanguage
                                },
                                LanguageNames,
                                !isTranslated)
                            FluxDispatcher.dispatch({
                                type: "MESSAGE_UPDATE",
                                message: {
                                    ...originalMessage,
                                    content: `${isTranslated ? translate : (existingCachedObject as object)[messageId]}`
                                        + ` ${isTranslated ? `\`[${settings.DislateLangAbbr
                                            ? (LanguageNames[toLanguage]).toUpperCase()
                                            : Format.string(toLanguage)}]\``
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

                            ActionSheet.hideActionSheet()
                        }}
                    />)
                    unpatch()
                })
            })
        }))
    },
    onUnload: () => {
        for (const unregisterCommands of commands) unregisterCommands()
        for (const unpatch of patches) unpatch()
    },
    settings: Settings
}
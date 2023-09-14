import { findByProps, findByStoreName } from "@vendetta/metro"
import { FluxDispatcher, React, i18n } from "@vendetta/metro/common"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findInReactTree } from "@vendetta/utils"
import { Format, Translate, settings } from "./common"
import { Forms } from "@vendetta/ui/components"
import { before, after } from "@vendetta/patcher"

import LanguageNamesArray from "./translate/languages/names"
import ISO from "./translate/languages/iso"
import { commands, Settings } from "./components"

const LazyActionSheet = findByProps("openLazy", "hideActionSheet")
const MessageStore = findByStoreName("MessageStore")
const ChannelStore = findByStoreName("ChannelStore")

const { FormRow, FormIcon } = Forms

const LanguageNames = Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] })))
let cachedData: object[] = [{ "invalid_id": "rosie and sapphire sucks" }]

let patches = []

export default {
    onLoad: () => {
        commands // recall to register command again

        // patch ActionSheet
        const unpatch = before("openLazy", LazyActionSheet, ([component, key, msg]) => {
            const message = msg?.message
            if (key !== "MessageLongPressActionSheet" || !message) return
            component.then(instance => {
                const unpatch = after("default", instance, (_, component) => {
                    React.useEffect(() => () => { unpatch() }, [])
                    const buttons = findInReactTree(component, x => x?.[0]?.type?.name === "ButtonRow")
                    if (!buttons) return

                    const position = Math.max(buttons.findIndex(x => x.props.message === i18n.Messages.MARK_UNREAD), 0)

                    const originalMessage = MessageStore.getMessage(
                        message.channel_id,
                        message.id
                    )
                    if (!originalMessage?.content && !message.content) return

                    const messageId = originalMessage.id ?? message.id
                    const messageContent = originalMessage.content ?? message.content
                    const existingCachedObject = cachedData.find((o: any) => Object.keys(o)[0] === messageId, "cache object")

                    let translateType = existingCachedObject ? "Revert" : "Translate"

                    const translate = async (from?: string) => {
                        const fromLanguage = from ?? settings.DislateLangFrom
                        const toLanguage = settings.DislateLangTo
                        const isTranslated = translateType === "Translate"
                        const translate = await Translate.translate(originalMessage.content,
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
                    }

                    buttons.splice(position, 0, <FormRow
                        label={`${translateType} Message`}
                        leading={<FormIcon style={{ opacity: 1 }} source={translateType === "Translate" ? getAssetIDByName("ic_locale_24px") : getAssetIDByName("ic_highlight")} />}
                        onPress={async () => {
                            await translate()
                            LazyActionSheet.hideActionSheet()
                        }}
                    /* work in progress | note: create actionsheet and show like ToLang page
                    onLongPress={() => {
                        showConfirmationAlert({ // temp
                            title: "Translate from",
                            content: (<></>),
                            onConfirm: async () => {
                                await translate("english")
                                ActionSheet.hideActionSheet()
                            }
                        })
                    }}
                    */
                    />)
                })
            })
        })
    },
    onUnload: () => {
        for (const unregisterCommands of commands) unregisterCommands()
        for (const unpatch of patches) unpatch()
    },
    settings: Settings
}

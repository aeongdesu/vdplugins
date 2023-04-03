import { translate, iso } from "./google"
import { findByName, findByProps, findByStoreName } from "@vendetta/metro"
import { FluxDispatcher } from "@vendetta/metro/common"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { showInputAlert } from "@vendetta/ui/alerts"
import { Forms } from "@vendetta/ui/components"
import { before, after } from "@vendetta/patcher"

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const MessageStore = findByStoreName("MessageStore")
const ChannelStore = findByStoreName("ChannelStore")
const ClydeUtils = findByProps("sendBotMessage")
const Icon = findByName("Icon")
const { FormRow } = Forms


const unpatch = before("openLazy", ActionSheet, (ctx) => {
    const [component, args, { message: message }] = ctx
    if (args !== "MessageLongPressActionSheet") return
    component.then(instance => {
        after("default", instance, (_, component) => {
            let buttons = component?.props?.children?.props?.children?.props?.children[1] as Array<JSX.Element>
            if (!buttons || !message.content || message.content === "") return

            const translateNOW = async (to?: string) => {
                try {
                    ClydeUtils.sendBotMessage(message.channel_id, "PROTOTYPE - PLEASE DON'T USE THIS!")
                    const translated = await translate(message.content, "auto", to ?? "ja")
                    const originalMessage = MessageStore.getMessage(message.channel_id, message.id)
                    FluxDispatcher.dispatch({
                        type: "MESSAGE_UPDATE",
                        message: {
                            ...originalMessage,
                            content: `${translated}\n\`[${"auto"} -> ${to ?? "ja"}]\``,
                            guild_id: ChannelStore.getChannel(originalMessage.channel_id).guild_id
                        },
                        log_edit: false
                    })
                } catch (e) {
                    ClydeUtils.sendBotMessage(message.channel_id, "Failed to translate message!")
                    console.error(e)
                }
            }

            buttons.push(<FormRow
                label="Translate Message"
                leading={<Icon source={getAssetIDByName("ic_locale_24px")} />}
                onPress={async () => {
                    ActionSheet.hideActionSheet()
                    await translateNOW()
                }}
                onLongPress={async () => {
                    ActionSheet.hideActionSheet()
                    showInputAlert({
                        title: "Translate to:",
                        initialValue: "",
                        placeholder: "en",
                        onConfirm: async (to) => {
                            if (!to) to = "auto"
                            await translateNOW(to)
                        },
                        confirmText: "Translate",
                        confirmColor: undefined,
                        cancelText: "Cancel"
                    })
                }}
            />)
        }, true)
    })
})

export const onUnload = () => unpatch()
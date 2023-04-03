import { translate, iso } from "./google"
import { findByName, findByProps, findByStoreName } from "@vendetta/metro"
import { FluxDispatcher } from "@vendetta/metro/common"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Forms } from "@vendetta/ui/components"
import { before, after } from "@vendetta/patcher"

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const MessageStore = findByStoreName("MessageStore")
const ChannelStore = findByStoreName("ChannelStore")
const Icon = findByName("Icon")
const { FormRow } = Forms


const unpatch = before("openLazy", ActionSheet, (ctx) => {
    const [component, args, message] = ctx
    if (args !== "MessageLongPressActionSheet") return
    component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
            let buttons = component?.props?.children?.props?.children?.props?.children[1] as Array<JSX.Element>
            if (!buttons) return
            buttons.push(<FormRow
                label="Translate Message"
                leading={<Icon source={getAssetIDByName("ic_locale_24px")} />}
                onPress={async () => {
                    ActionSheet.hideActionSheet()
                    try {
                        const translated = await translate(message.content, "auto", "ko")
                        const originalMessage = MessageStore.getMessage(message.channel_id, message.id)
                        FluxDispatcher.dispatch({
                            type: "MESSAGE_UPDATE",
                            message: {
                                ...message,
                                content: `${translated}`
                            },
                            log_edit: false
                        })
                    } catch (e) {
                        console.error(e)
                    }
                }}
            />)
            unpatch()
        })
    })
})

export const onUnload = () => unpatch()
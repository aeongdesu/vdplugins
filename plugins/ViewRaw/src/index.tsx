import { before, after } from "@vendetta/patcher"
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets"
import { findByProps as getByProps, findByName } from "@vendetta/metro"
import { NavigationNative } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import RawPage from "./RawPage"

export let message: any

const ActionSheet = getByProps("openLazy", "hideActionSheet")
const navigation = NavigationNative.useNavigation()
const Icon = findByName("Icon")
const { FormRow } = Forms

const unpatch = before("openLazy", ActionSheet, (ctx) => {
    const [component, args, actionMessage] = ctx
    if (args != "MessageLongPressActionSheet") return
    component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
            const [msgProps, oldbuttons] = component.props?.children?.props?.children?.props?.children
            if (!msgProps) message = actionMessage.message
            else message = msgProps.props.message
            if (!oldbuttons) return
            
            component.props.children.props.children.props.children[1] = [...oldbuttons,
            <FormRow
                label="View Raw"
                leading={<Icon source={getAssetId("ic_chat_bubble_16px")} />}
                onPress={() => {
                    ActionSheet.hideActionSheet()
                    navigation.push("RawPage", {
                        title: "ViewRaw",
                        render: RawPage
                    })
                }}
            />]
            unpatch()
        })
    })
})

export const onUnload = () => unpatch()

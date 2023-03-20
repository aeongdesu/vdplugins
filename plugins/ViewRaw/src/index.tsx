import { before, after } from "@vendetta/patcher"
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets"
import { findByProps as getByProps } from "@vendetta/metro"
import RawPage from "./RawPage"

export let message: any

const ActionSheet = getByProps("hideActionSheet")
const Navigation = getByProps("push", "pushLazy", "pop")
const DiscordNavigator = getByProps("getRenderCloseButton")
const { default: Navigator, getRenderCloseButton } = DiscordNavigator

const unpatch = before("openLazy", ActionSheet, (ctx) => {
    const [component, args, actionMessage] = ctx
    if (args == "MessageLongPressActionSheet")
        component.then(instance => {
            const unpatch = after("default", instance, (_, component) => {
                const [msgProps, oldbuttons] = component.props?.children?.props?.children?.props?.children
                if (!msgProps) message = actionMessage.message
                else message = msgProps.props.message
                if (oldbuttons) {
                    const MarkUnreadIndex = oldbuttons.findIndex((a: { props: { message: string } }) => a.props.message == "Copy Message Link")
                    const ButtonRow = oldbuttons[MarkUnreadIndex].type
                    const navigator = () => (
                        <Navigator
                            initialRouteName="RawPage"
                            goBackOnBackPress={true}
                            screens={{
                                RawPage: {
                                    title: "ViewRaw",
                                    headerLeft: getRenderCloseButton(() => Navigation.pop()),
                                    render: RawPage
                                }
                            }}
                        />
                    )
                    component.props.children.props.children.props.children[1] = [...oldbuttons,
                    <ButtonRow
                        key={-1}
                        message="View Raw"
                        iconSource={getAssetId("ic_chat_bubble_16px")}
                        onPressRow={() => {
                            ActionSheet.hideActionSheet()
                            Navigation.push(navigator)
                        }}
                    />]
                }
                unpatch()
            })
        })
})

export const onUnload = () => unpatch()
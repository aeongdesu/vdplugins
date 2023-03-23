// https://github.com/ssense1337/enmity-plugins/blob/main/Dashless/src/index.tsx
import { ReactNative } from "@vendetta/metro/common"
import { after } from "@vendetta/patcher"
import { findInReactTree } from "@vendetta/utils"

const { View } = ReactNative

const unpatch = after("render", View, (_, res) => {
    const textChannel = findInReactTree(res, r => r?.props?.channel?.name && r?.props?.hasOwnProperty?.("isRulesChannel"))
    if (!textChannel) return
    after("type", textChannel.type, (_, res) => {
        const textChannelName = findInReactTree(res, r => typeof r?.children === "string")
        if (!textChannelName) return
        textChannelName.children = textChannelName.children.replace(/-/g, " ")
        return res
    })
    unpatch()
})

export const onUnload = () => unpatch()

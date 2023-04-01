import { before } from "@vendetta/patcher"
import { ReactNative } from "@vendetta/metro/common"

const chatManager = ReactNative.NativeModules.DCDChatManager

const regex = /(?<=enableSwipeToReply":)(true)/g

const unpatch = before("updateRows", chatManager, args => args[1] = args[1].replace(regex, "false"))

export const onUnload = () => unpatch()
import { before } from "@vendetta/patcher"
import { ReactNative } from "@vendetta/metro/common"

const chatManager = ReactNative.NativeModules.DCDChatManager

const unpatch = before("updateRows", chatManager, (args: any) => {
    const messages = JSON.parse(args[1])
    let newMessages = []
    for (let i = 0; i < messages.length; i++) {
        const data = messages[i]
        if (data.enableSwipeToReply === undefined || data.enableSwipeToReply === false) continue
        data.enableSwipeToReply = false
        newMessages.push(messages[i])
        args[1] = JSON.stringify(newMessages)
    }
})

export const onUnload = () => unpatch()
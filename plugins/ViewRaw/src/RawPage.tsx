import { findByName, findByProps, findByStoreName } from "@vendetta/metro"
import { ReactNative, clipboard, React } from "@vendetta/metro/common"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Button } from "@vendetta/ui/components"
import { cleanMessage } from "./cleanMessage"

const { default: ChatItemWrapper } = findByProps(
  "DCDAutoModerationSystemMessageView",
  "default"
)
const MessageRecord = findByName("MessageRecord")
const RowManager = findByName("RowManager")

const { ScrollView } = ReactNative

export default function RawPage({ message }) {
    const stringMessage = React.useMemo(() => JSON.stringify(cleanMessage(message), null, 4), [message.id])

    const style = { marginBottom: 8 }

    return (<>
        <ScrollView style={{ flex: 1, marginHorizontal: 13, marginVertical: 10 }}>
            <Button
                style={style}
                text="Copy Raw Content"
                color="brand"
                size="small"
                disabled={!message.content}
                onPress={() => {
                    clipboard.setString(message.content)
                    showToast("Copied content to clipboard", getAssetIDByName("toast_copy_link"))
                }}
            />
            <Button
                text="Copy Raw Data"
                style={style}
                color="brand"
                size="small"
                onPress={() => {
                    clipboard.setString(stringMessage)
                    showToast("Copied data to clipboard", getAssetIDByName("toast_copy_link"))
                }}
            />
           <ChatItemWrapper
               rowGenerator={new RowManager()}
               message={
                   new MessageRecord({
                       id: "0",
                       channel_id: message.channel_id,
                       author: message.author,
                       content: message.content + "\n\n```js\n" + stringMessage + "\n```",
                   })
               }
           />
        </ScrollView>
    </>)
}

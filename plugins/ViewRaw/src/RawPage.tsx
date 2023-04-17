import { findByProps as getByProps } from "@vendetta/metro"
import { ReactNative, constants as Constants, clipboard, React } from "@vendetta/metro/common"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets"
import { Codeblock } from "@vendetta/ui/components"
import { cleanMessage } from "./cleanMessage"

const { ScrollView, Text } = ReactNative
const Button = getByProps("ButtonColors", "ButtonLooks", "ButtonSizes").default as any

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
                    showToast("Copied content to clipboard", getAssetId("toast_copy_link"))
                }}
            />
            <Button
                text="Copy Raw Data"
                style={style}
                color="brand"
                size="small"
                onPress={() => {
                    clipboard.setString(stringMessage)
                    showToast("Copied data to clipboard", getAssetId("toast_copy_link"))
                }}
            />
            {message.content && <Codeblock selectable style={style}>{message.content}</Codeblock>}
            <Codeblock selectable>{stringMessage}</Codeblock>
        </ScrollView>
    </>)
}

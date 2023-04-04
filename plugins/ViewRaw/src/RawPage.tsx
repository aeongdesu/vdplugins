import { find, findByProps as getByProps } from "@vendetta/metro"
import { ReactNative, constants as Constants, clipboard, React } from "@vendetta/metro/common"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets"

import { cleanMessage } from "./cleanMessage"

const { ScrollView, Text, TextInput, Platform } = ReactNative
const { OS } = Platform
const Button = getByProps("ButtonColors", "ButtonLooks", "ButtonSizes").default as any
const Parser = find(m => m.defaultRules?.codeBlock)

console.log(Parser)

export default function RawPage({ message }) {
    const stringMessage = React.useMemo(() => JSON.stringify(cleanMessage(message), null, 4), [message.id])

    return (<>
        <ScrollView style={{ flex: 1, marginHorizontal: 13, marginVertical: 10 }}>
            <Button
                text="Copy Raw Data"
                color="brand"
                size="small"
                onPress={() => {
                    clipboard.setString(stringMessage)
                    showToast("Copied data to clipboard", getAssetId("toast_copy_link"))
                }}
            />
            {(OS == "ios")
                ? <TextInput
                    style={{ fontFamily: Constants.Fonts.CODE_SEMIBOLD, fontSize: 12, backgroundColor: "#282b30", color: "white", marginTop: 10, borderRadius: 3, padding: 10 }}
                    onChange={() => { }}
                    multiline
                    value={stringMessage}
                />
                : <Text selectable style={{ fontFamily: Constants.Fonts.CODE_SEMIBOLD, fontSize: 12, backgroundColor: "#282b30", color: "white", marginTop: 10, borderRadius: 3, padding: 10 }}>
                    {stringMessage}
                </Text>}
        </ScrollView>
    </>)
}

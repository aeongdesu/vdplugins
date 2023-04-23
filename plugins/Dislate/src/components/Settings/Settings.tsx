import { getAssetIDByName } from "@vendetta/ui/assets"
import { React, ReactNative, stylesheet, constants, NavigationNative, url } from "@vendetta/metro/common"
import { semanticColors } from "@vendetta/ui"
import { Forms } from "@vendetta/ui/components"
import { manifest } from "@vendetta/plugin"
import { settings } from "../../common"

import ToLang from "./ToLang"

const { ScrollView, Text } = ReactNative
const { FormRow } = Forms

const styles = stylesheet.createThemedStyleSheet({
    subheaderText: {
        color: semanticColors.HEADER_SECONDARY,
        textAlign: 'center',
        margin: 10,
        marginBottom: 50,
        letterSpacing: 0.25,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        fontSize: 14
    }
})

export default () => {
    const navigation = NavigationNative.useNavigation()

    return (
        <ScrollView>
            {/* work in progress
            <Text>
                {"long press button to set translate from"}
            </Text>
            */}
            <FormRow
                label={"Translate to"}
                subLabel={settings.DislateLangTo}
                leading={<FormRow.Icon source={getAssetIDByName("ic_activity_24px")} />}
                trailing={() => <FormRow.Arrow />}
                onPress={() => navigation.push("VendettaCustomPage", {
                    title: "Translate to",
                    render: ToLang,
                })}
            />

            <Text style={styles.subheaderText} onPress={() => url.openURL("https://github.com/aeongdesu/vdplugins")}>
                {`Build: (${manifest.hash.substring(0, 7)})`}
            </Text>
        </ScrollView>
    )
}
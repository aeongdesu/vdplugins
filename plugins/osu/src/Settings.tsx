import { React, ReactNative, stylesheet as Styles, url, constants } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { semanticColors } from "@vendetta/ui"
import { settings } from "./utils"

const { ScrollView, Text } = ReactNative
const { FormSection, FormInput, FormDivider } = Forms

const styles = Styles.createThemedStyleSheet({
    subText: {
        fontSize: 14,
        marginHorizontal: 15,
        color: semanticColors.TEXT_MUTED,
        fontFamily: constants.Fonts.PRIMARY_NORMAL
    },
    textLink: {
        color: semanticColors.TEXT_LINK
    }
})

export default () => {
    return (
        <ScrollView style={{ flex: 1, marginHorizontal: 3, marginVertical: 3 }}>
            <FormSection title="apiv2 configuration" titleStyleType="no_border">
                <Text style={styles.subText}>You will need to register an OAuth application on your <Text style={styles.textLink} onPress={() => url.openURL("https://osu.ppy.sh/home/account/edit#new-oauth-application")}>account settings page</Text>.</Text>
                <Text style={styles.subText}>Application Callback URL is not required!</Text>
                <FormInput
                    title="Client ID"
                    value={settings.clientID}
                    placeholder="00000"
                    onChangeText={(value: string) => settings.clientID = value}
                />
                <FormInput
                    title="Client Secret"
                    value={settings.clientSecret}
                    placeholder="asdfghjkl"
                    onChangeText={(value: string) => settings.clientSecret = value}
                />
            </FormSection>
            <FormDivider />
            <FormSection title="default user" titleStyleType="no_border">
                <FormInput
                    title="User"
                    value={settings.user}
                    placeholder="peppy"
                    onChangeText={(value: string) => settings.user = value}
                />
            </FormSection>
        </ScrollView>
    )
}
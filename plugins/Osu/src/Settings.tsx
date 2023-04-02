import { React, ReactNative } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { settings } from "./utils"

const { ScrollView } = ReactNative
const { FormSection, FormInput, FormDivider } = Forms

export default () => {

    return (
        <ScrollView style={{ flex: 1 }}>
            <FormSection title="apiv2 configuration" titleStyleType="no_border">
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
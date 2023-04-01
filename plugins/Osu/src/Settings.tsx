import { React, ReactNative } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { useProxy } from "@vendetta/storage"
import { storage } from "@vendetta/plugin"

const { ScrollView } = ReactNative
const { FormSection, FormInput } = Forms

type SettingsType = {
    clientID: string,
    clientSecret: string,
    accessToken: string
}

export default () => {
    const settings = useProxy(storage) as SettingsType

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
        </ScrollView>
    )
}
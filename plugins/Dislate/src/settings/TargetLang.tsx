import { getAssetIDByName } from "@vendetta/ui/assets"
import { React, ReactNative } from "@vendetta/metro/common"
import { Forms, Search } from "@vendetta/ui/components"
import { showToast } from "@vendetta/ui/toasts"
import { useProxy } from "@vendetta/storage"
import { settings } from ".."
import Lang from "../lang"

const { FormRow } = Forms
const { ScrollView } = ReactNative

export default () => {
    useProxy(settings)
    const [query, setQuery] = React.useState("")
    return (<ScrollView style={{ flex: 1 }}>
        <Search
            style={{ padding: 15 }}
            placeholder="Search Language"
            onChangeText={(text: string) => {
                setQuery(text)
            }}
        />
        {
            Object.entries(Lang).filter(([key, value]) => key.includes(query)).map(([key, value]) => <FormRow
                label={key}
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    if (settings.target_lang == value) return
                    settings.target_lang = value
                    showToast(`Saved ToLang to ${key}`, getAssetIDByName("check"))
                }}
            />)
        }
    </ScrollView>)
}
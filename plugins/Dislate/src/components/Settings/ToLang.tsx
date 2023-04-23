import { getAssetIDByName } from "@vendetta/ui/assets"
import { React, ReactNative } from "@vendetta/metro/common"
import { Forms, Search } from "@vendetta/ui/components"
import LanguageNames from "../../translate/languages/names"
import { settings } from "../../common"
import { showToast } from "@vendetta/ui/toasts"

const { FormRow } = Forms
const { ScrollView } = ReactNative

export default () => {
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
            Object.values(LanguageNames).filter((e: string) => e !== "detect").filter(i => i.includes(query)).map((i, id) => <FormRow
                label={i}
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    if (settings.DislateLangTo == i) return
                    settings.DislateLangTo = i
                    showToast(`Saved ToLang to ${settings.DislateLangTo}`, getAssetIDByName("check"))
                }}
            />)
        }
    </ScrollView>)
}
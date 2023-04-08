import { React, ReactNative, stylesheet as Styles, url, constants } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { semanticColors } from "@vendetta/ui"
import { settings } from "../../common"
import { findByName } from "@vendetta/metro"

const { ScrollView, Text } = ReactNative
const { FormSection, FormInput, FormDivider } = Forms

const Search = findByName("StaticSearchBarContainer")

export default () => {
    const [query, setQuery] = React.useState("")

    return (
        <ScrollView>
            <Search
                placeholder="Search Language"
                onChangeText={(text: string) => {
                    setQuery(text)
                }}
            />
            
        </ScrollView>
    )
}
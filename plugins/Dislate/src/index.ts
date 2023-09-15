import { storage } from "@vendetta/plugin"
import patchActionSheet from "./patches/ActionSheet"
import Settings from "./Settings"

export const settings: {
    source_lang?: string
    target_lang?: string
} = storage

settings.target_lang ??= "EN"

let patches = []

export default {
    onLoad: () => {
        patches.push(patchActionSheet())
    },
    onUnload: () => { for (const unpatch of patches) unpatch() },
    settings: Settings
}


import { storage } from "@vendetta/plugin"
import patchActionSheet from "./patches/ActionSheet"

export const settings: {
    source_lang?: string
    target_lang?: string
} = storage

settings.target_lang ??= "ko"

let patches = []

export default {
    onLoad: () => {
        patches.push(patchActionSheet())
    },
    onUnload: () => { for (const unpatch of patches) unpatch() },
}


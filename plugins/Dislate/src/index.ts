import { storage } from "@vendetta/plugin"
import patches from "./patches"

export const settings: {
    source_lang?: string
    target_lang?: string
} = storage

settings.target_lang ??= "ko"

export default {
    // onLoad: () => { for (const patch of patches) patch() },
    onUnload: () => { for (const unpatch of patches) unpatch() },
}


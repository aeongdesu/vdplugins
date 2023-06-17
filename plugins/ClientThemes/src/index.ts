import { findByProps } from "@vendetta/metro"
import { instead, after } from "@vendetta/patcher"
import { storage } from "@vendetta/plugin"

const AppearanceSettings = findByProps("setShouldSyncAppearanceSettings")
const canUse = findByProps("canUseClientThemes")
const ThemeUtils = findByProps("updateBackgroundGradientPreset")

AppearanceSettings.setShouldSyncAppearanceSettings(false)
if (storage.theme && storage.isEnabled) {
    ThemeUtils.updateBackgroundGradientPreset(storage.theme)
}

const patches = [
    instead("setShouldSyncAppearanceSettings", AppearanceSettings, () => false),
    instead("canUseClientThemes", canUse, () => true),
    after("updateMobilePendingThemeIndex", ThemeUtils, (args) => {
        storage.isEnabled = args[0] > 1 // 0 ~ 1 | default || 2 ~ | client themes
    }),
    after("updateBackgroundGradientPreset", ThemeUtils, (args) => {
        storage.theme = args[0]
    })
]

export const onUnload = () => {
    for (const unpatch of patches) unpatch()
}

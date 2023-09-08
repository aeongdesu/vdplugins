import { findByProps } from "@vendetta/metro"
import { instead, after } from "@vendetta/patcher"
import { storage } from "@vendetta/plugin"


const AppearanceSettings = findByProps("setShouldSyncAppearanceSettings")
const canUse = findByProps("canUseClientThemes", false)
const ThemeUtils = findByProps("updateBackgroundGradientPreset")
// const { ClientThemesNewThemesExperiment } = findByProps("ClientThemesNewThemesExperiment")
const { ClientThemesMobileExperiment } = findByProps("ClientThemesMobileExperiment")

storage.isEnabled ??= false

// ClientThemesNewThemesExperiment.getCurrentConfig().hasNewClientThemes = true
ClientThemesMobileExperiment.getCurrentConfig().hasClientThemes = true

AppearanceSettings.setShouldSyncAppearanceSettings(false)
if (storage.theme && storage.isEnabled) {
    ThemeUtils.updateBackgroundGradientPreset(storage.theme)
}

// unfreeze canUse object
canUse.default = { ...canUse.default }

const patches = [
    instead("setShouldSyncAppearanceSettings", AppearanceSettings, () => !storage.isEnabled),
    instead("canUseClientThemes", canUse.default, () => true),
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


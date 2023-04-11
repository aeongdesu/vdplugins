import { findByProps } from "@vendetta/metro"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { instead } from "@vendetta/patcher"
import { storage } from "@vendetta/plugin"

export const onLoad = () => {
    instead("canUseClientThemes", findByProps("canUseClientThemes"), () => true)
    instead("canUseCustomBackgrounds", findByProps("canUseCustomBackgrounds"), () => true)

    const { ClientThemesExperiment } = findByProps("ClientThemesExperiment")
    ClientThemesExperiment.getCurrentConfig().hasClientThemes = true
    const { ClientThemesNewThemesExperiment } = findByProps("ClientThemesNewThemesExperiment")
    ClientThemesNewThemesExperiment.getCurrentConfig().hasNewClientThemes = true
    const { ClientThemesMobileExperiment } = findByProps("ClientThemesMobileExperiment")
    ClientThemesMobileExperiment.getCurrentConfig().hasClientThemes = true
    if (!storage.noticed) {
        showToast("Please disable sync theme to work ClientThemes", getAssetIDByName("check"))
        storage.noticed = true
    }
    const { MultiAccountMobileExperiment } = findByProps("MultiAccountMobileExperiment")
    MultiAccountMobileExperiment.getCurrentConfig().isMultiAccountMobileEnabled = true
}
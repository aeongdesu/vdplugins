import { findByProps } from "@vendetta/metro"
import { FluxDispatcher } from "@vendetta/metro/common"
import { instead } from "@vendetta/patcher"

export const onLoad = () => {
    const start = () => {
        try {
            instead("canUseClientThemes", findByProps("canUseClientThemes"), () => true)

            findByProps("ClientThemesMobileExperiment").ClientThemesMobileExperiment.getCurrentConfig().hasClientThemes = true

            // findByProps("updateTheme").updateTheme("dark")

            FluxDispatcher.dispatch({
                type: "EXPERIMENT_OVERRIDE_BUCKET",
                experimentId: "2023-02_client_themes_mobile",
                experimentBucket: 1
            })

            FluxDispatcher.dispatch({ // bc fun
                type: "EXPERIMENT_OVERRIDE_BUCKET",
                experimentId: "2022-12_swipe_to_reply",
                experimentBucket: 0
            })

            FluxDispatcher.unsubscribe("I18N_LOAD_START", start)
        } catch (e) {
            console.error(e)
        }
    }

    FluxDispatcher.subscribe("I18N_LOAD_START", start)
}
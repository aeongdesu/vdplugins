import { logger } from "@vendetta"
import { FluxDispatcher } from "@vendetta/metro/common"

// weird method i think

export const onLoad = () => {
    const setExperiment = () => {
        try {
            FluxDispatcher.dispatch({
                type: "EXPERIMENT_OVERRIDE_BUCKET",
                experimentId: "2022-12_swipe_to_reply",
                experimentBucket: 1
            })
            FluxDispatcher.unsubscribe("I18N_LOAD_START", setExperiment)
        } catch (e) {
            logger.error(e)
        }
    }

    FluxDispatcher.subscribe("I18N_LOAD_START", setExperiment)
}
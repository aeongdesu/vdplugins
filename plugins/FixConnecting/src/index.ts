// https://github.com/m4fn3/FixConnecting/blob/master/src/index.tsx

import { findByProps, findByStoreName } from "@vendetta/metro"
import { FluxDispatcher } from "@vendetta/metro/common"
import { after } from "@vendetta/patcher"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { showToast } from "@vendetta/ui/toasts"

const startSession = findByProps("startSession")
const AuthenticationStore = findByStoreName("AuthenticationStore")

let timeout: number

const unpatch = after("startSession", startSession, () => {
    unpatch()
    timeout = setTimeout(() => {
        let session_id = AuthenticationStore.getSessionId()
        if (!session_id) {
            FluxDispatcher?.dispatch({type: "APP_STATE_UPDATE", state: "active"})
            showToast("Automatically fixed Connecting bug!", getAssetIDByName("Check"))
        }
    }, 300)
})

export const onUnload = () => {
    unpatch()
    if (timeout) clearTimeout(timeout) // idk why but afraid
}
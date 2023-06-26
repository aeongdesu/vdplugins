// thanks cyn
import { findByProps } from "@vendetta/metro"
import { instead } from "@vendetta/patcher"
import { showConfirmationAlert } from "@vendetta/ui/alerts"

const accounts = findByProps("MAX_ACCOUNTS")
let unpatch: () => any

export const onLoad = () => {
    accounts.MAX_ACCOUNTS = 100
    unpatch = instead("MAX_ACCOUNTS", accounts, () => 100)
}

export const onUnload = () => {
    showConfirmationAlert({
        title: "Hold on",
        content: "Disabling plugin will *remove* accounts to 3. Are you sure?",
        onConfirm: () => {
            unpatch?.()
        }
    })
}
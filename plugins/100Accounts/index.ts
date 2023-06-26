// thanks cyn
import { findByProps } from "@vendetta/metro"
import { showConfirmationAlert } from "@vendetta/ui/alerts"

const accounts = findByProps("MAX_ACCOUNTS")
const DEFAULT_VALUE = 3

export const onLoad = () => {
    accounts.MAX_ACCOUNTS = 100
}

export const onUnload = () => showConfirmationAlert({
    title: "Hold on",
    content: "Disabling plugin will *remove* accounts to 3 (default). Are you sure?",
    onConfirm: () => accounts.MAX_ACCOUNTS = DEFAULT_VALUE,
    confirmText: "YEP",
    cancelText: "COPE",
    isDismissable: false
})
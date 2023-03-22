import { findByStoreName, findByProps } from "@vendetta/metro"
import { after, instead } from "@vendetta/patcher"

const NSFWStuff = findByProps("isNSFWInvite")
const UserStore = findByStoreName("UserStore")

let patches = []

patches.push(instead("handleNSFWGuildInvite", NSFWStuff, () => false))
patches.push(instead("isNSFWInvite", NSFWStuff, () => false))
patches.push(instead("shouldNSFWGateGuild", NSFWStuff, () => false))

patches.push(after("getCurrentUser", UserStore, (_, user) => {
    if (user?.hasOwnProperty("nsfwAllowed")) {
        user.nsfwAllowed = true
    }
    return user
}))

export const onUnload = () => {
    for (const unpatch of patches) unpatch()
}

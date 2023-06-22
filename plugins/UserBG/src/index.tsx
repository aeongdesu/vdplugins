import { findByProps } from "@vendetta/metro"
import { after } from "@vendetta/patcher"

import { data, fetchDB } from "./fetchDB"
import Settings from "./Settings"

type userBGData = {
    _id: string
    uid: string
    img: string
    orientation: string
}

fetchDB().then(res => res)

const unpatch = after("getUserBannerURL", findByProps("default", "getUserBannerURL"), ([user]) => {
    const customBanner = data?.find((i: userBGData) => i.uid === user?.id) as userBGData
    if (user?.banner === undefined && customBanner) return customBanner.img
})

export const onUnload = () => unpatch()

export const settings = Settings
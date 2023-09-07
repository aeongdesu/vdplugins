import { logger } from "@vendetta"
import { findByProps } from "@vendetta/metro"
import { after } from "@vendetta/patcher"
import { safeFetch } from "@vendetta/utils"
import { showToast } from "@vendetta/ui/toasts"

import Settings from "./Settings"

interface userBGData {
    _id: string
    uid: string
    img: string
    orientation: string
}

const getUserBannerURL = findByProps("default", "getUserBannerURL")

let data: userBGData[]
let unpatch: () => void

export const fetchData = async () => {
    try {
        data = await (await safeFetch("https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json", { cache: "no-store" })).json()
        return data
    } catch (e) {
        logger.error("Failed to fetch userBG data", e)
    }
}

export const onLoad = async () => {
    await fetchData()
    if (!data) return showToast("Failed to load DB")

    unpatch = after("getUserBannerURL", getUserBannerURL, ([user]) => {
        const customBanner = data?.find((i: userBGData) => i.uid === user?.id)
        if (user?.banner === undefined && customBanner) return customBanner.img
    })
}

export const onUnload = () => unpatch?.()

export const settings = Settings
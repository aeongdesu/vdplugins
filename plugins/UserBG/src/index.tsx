import { logger } from "@vendetta"
import { findByProps } from "@vendetta/metro"
import { after } from "@vendetta/patcher"
import { safeFetch } from "@vendetta/utils"

import Settings from "./Settings"

interface userBGData {
    _id: string
    uid: string
    img: string
    orientation: string
}

const getUserBannerURL = findByProps("default", "getUserBannerURL")

let data: userBGData[]

const fetchData = async () => {
    try {
        data = await (await safeFetch("https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json", { cache: "no-store" })).json()
    } catch (e) {
        logger.error("Failed to fetch userBG data", e)
    }
}

export default async () => {
    await fetchData()
    if (!data) return () => { }

    const unpatch = after("getUserBannerURL", getUserBannerURL, ([user]) => {
        const customBanner = data?.find((i: userBGData) => i.uid === user?.id)
        if (user?.banner === undefined && customBanner) return customBanner.img
    })

    return () => unpatch()
}

export const settings = Settings
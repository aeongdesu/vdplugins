import { findByName, findByStoreName, findByProps } from "@vendetta/metro"
import { before, after } from "@vendetta/patcher"

let patches = []

type userBGData = {
    _id: string
    uid: string
    img: string
    orientation: string
}

const ProfileBanner = findByName("ProfileBanner", false)

export const onLoad = async () => {
    const datab = await fetch("https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json").then(res => {
        if (!res.ok) throw new Error("Failed to fetch UserBG data!")
        return res.json()
    })

    patches = [
        before("getUserBannerURL", findByProps("default", "getUserBannerURL"), (args) => {
            const userid = args[0]?.id
            const unpatch = before("default", ProfileBanner, (ctx: any) => {
                const banner = ctx[0]
                if (!banner.bannerSource) {
                    const customBanner = datab.find((i: userBGData) => i.uid === userid) as userBGData
                    if (customBanner) {
                        banner.bannerSource = { uri: customBanner.img }
                    }
                }
                unpatch()
            }, true)
        })
    ]
}

export const onUnload = () => {
    for (const unpatch of patches) unpatch()
}
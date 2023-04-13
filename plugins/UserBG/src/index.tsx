import { logger } from "@vendetta"
import { findByName } from "@vendetta/metro"
import { before } from "@vendetta/patcher"

let patches = []

type userBGData = {
    _id: string
    uid: string
    img: string
    orientation: string
}

const HeaderAvatar = findByName("HeaderAvatar", false)
const ProfileBanner = findByName("ProfileBanner", false)

export const onLoad = async () => {
    const datab = await fetch("https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json").then(res => {
        if (!res.ok) throw new Error("Failed to fetch UserBG data!")
        return res.json()
    })

    patches = [
        before("default", HeaderAvatar, (ctx: any) => {
            const userid = ctx[0]?.user?.id
            const unpatch = before("default", ProfileBanner, (ctx: any) => {
                const banner = ctx[0]
                try {
                    if (!banner.bannerSource) {
                        const customBanner = datab.find((i: userBGData) => i.uid === userid) as userBGData
                        if (customBanner) {
                            banner.bannerSource = { uri: customBanner.img }
                        }
                    }
                } catch (e) {
                    logger.error("UserBG Error:", e)
                }
                unpatch()
            })
        })
    ]
}

export const onUnload = () => {
    for (const unpatch of patches) unpatch()
}
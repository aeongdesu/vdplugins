import { logger } from "@vendetta"
import { findByDisplayName } from "@vendetta/metro"
import { after } from "@vendetta/patcher"
import { findInReactTree } from "@vendetta/utils"

const GuildsConnected = findByDisplayName("GuildsConnected", false)

const unpatch = after("default", GuildsConnected, (_, res) => {
    const gf = findInReactTree(res, (r => r.guildFolders))
    if (!gf) return
    gf.guildFolders.forEach(folder => {
        if (!folder.guilds) return
        const remove = folder.guilds.find(guild => guild.id === "727407178499096597" || guild.id === "1020211393775009813")
        if (remove) {
            if (folder.guilds.length > 1) {
                folder.guilds = folder.guilds.filter(f => f !== remove)
                if (folder.guilds.length === 1) delete gf.guildFolders[folder.index]
                console.log(folder.guilds)
            }
            else delete gf.guildFolders[folder.index]
        }
    })
})

export const onUnload = () => unpatch()

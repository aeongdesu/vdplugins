import { getSettings } from "@vendetta/plugins"
import { plugin } from "@vendetta"
import { registerCommand } from "@vendetta/commands"
import { storage } from "@vendetta/plugin"
import { React, NavigationNative } from "@vendetta/metro/common"

export default registerCommand({
    name: "osu-profile",
    displayName: "osu-profile",
    description: "Display statistics of a user",
    displayDescription: "Display statistics of a user",
    options: [{
        name: "username",
        displayName: "username",
        description: "Specify a username, ID, or URL of the player",
        displayDescription: "Specify a username, ID, or URL of the player",
        required: false,
        type: 3
    }],
    applicationId: "",
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
        console.log(storage)
        if (!storage.clientID || !storage.clientSecret) return getSettings(plugin.id)
    }
})
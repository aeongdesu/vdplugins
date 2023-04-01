import { registerCommand } from "@vendetta/commands"

export default registerCommand({
    name: "osu-beatmap",
    displayName: "osu-beatmap",
    description: "Sends an info message about the specified beatmap",
    displayDescription: "Sends an info message about the specified beatmap",
    options: [{
        name: "id",
        displayName: "id",
        description: "Specify a beatmap URL or ID",
        displayDescription: "Specify a beatmap URL or ID",
        required: true,
        type: 3
    }],
    applicationId: "",
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
    }
})
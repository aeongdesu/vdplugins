import { registerCommand } from "@vendetta/commands"
import { findByProps, findByStoreName } from "@vendetta/metro"
import { ApplicationCommandType, ApplicationCommandInputType } from "../../../ApplicationCommandTypes"

const { sendBotMessage } = findByProps("sendBotMessage")
// thinking
// const setText = findByProps("setText")
const SpotifyStore = findByStoreName("SpotifyStore")

let commands = []

commands.push(registerCommand({
    name: "spotify track",
    displayName: "spotify track",
    description: "Send your current Spotify track to chat",
    displayDescription: "Send your current Spotify track to chat",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    options: [],
    execute(args, ctx) {
        const track = SpotifyStore.getTrack()
        if (!track) return sendBotMessage(ctx.channel.id, "You're not listening to any music.")
        return { content: `https://open.spotify.com/track/${track.id}` }
    }
}))

commands.push(registerCommand({
    name: "spotify album",
    displayName: "spotify album",
    description: "Send your current Spotify album to chat",
    displayDescription: "Send your current Spotify album to chat",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    options: [],
    execute(args, ctx) {
        const track = SpotifyStore.getTrack()
        if (!track) return sendBotMessage(ctx.channel.id, "You're not listening to any music.")
        return { content: `https://open.spotify.com/album/${track.album.id}` }
    }
}))

commands.push(registerCommand({
    name: "spotify artist",
    displayName: "spotify artist",
    description: "Send your current Spotify artist to chat",
    displayDescription: "Send your current Spotify artist to chat",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    options: [],
    execute(args, ctx) {
        const track = SpotifyStore.getTrack()
        if (!track) return sendBotMessage(ctx.channel.id, "You're not listening to any music.")
        return { content: track.artists[0].external_urls.spotify }
    }
}))

export const onUnload = () => {
    for (const unregisterCommands of commands) unregisterCommands()
}

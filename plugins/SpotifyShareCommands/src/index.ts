// https://github.com/Vendicated/Vencord/blob/main/src/plugins/spotifyShareCommands.ts
import { registerCommand } from "@vendetta/commands";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { ApplicationCommandType, ApplicationCommandInputType } from "../../../ApplicationCommandTypes";

const { sendBotMessage } = findByProps("sendBotMessage");
const SpotifyStore = findByStoreName("SpotifyStore");

const noSpotifySession = (ctx: any) => sendBotMessage(ctx.channel.id, "You're not listening to any music.");

let commands = [];

commands.push(registerCommand({
    name: "spotify track",
    displayName: "spotify track",
    description: "Send your current Spotify track to chat",
    displayDescription: "Send your current Spotify track to chat",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    execute(args, ctx) {
        const track = SpotifyStore.getTrack();
        if (!track) noSpotifySession(ctx);
        return { content: `https://open.spotify.com/track/${track.id}?si=0` };
    }
}));

commands.push(registerCommand({
    name: "spotify album",
    displayName: "spotify album",
    description: "Send your current Spotify album to chat",
    displayDescription: "Send your current Spotify album to chat",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    execute(args, ctx) {
        const track = SpotifyStore.getTrack();
        if (!track) noSpotifySession(ctx);
        return { content: `https://open.spotify.com/album/${track.album.id}?si=0` };
    }
}));

commands.push(registerCommand({
    name: "spotify artist",
    displayName: "spotify artist",
    description: "Send your current Spotify artist to chat",
    displayDescription: "Send your current Spotify artist to chat",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    execute(args, ctx) {
        const track = SpotifyStore.getTrack();
        if (!track) noSpotifySession(ctx);
        return { content: `${track.artists[0].external_urls.spotify}?si=0` };
    }
}));

commands.push(registerCommand({
    name: "spotify cover",
    displayName: "spotify cover",
    description: "Send your current Spotify track's cover to chat",
    displayDescription: "Send your current Spotify track's cover to chat",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    execute(args, ctx) {
        const track = SpotifyStore.getTrack();
        if (!track) noSpotifySession(ctx);
        return { content: `${track.album.image.url}` };
    }
}));

commands.push(registerCommand({
    name: "spotify info",
    displayName: "spotify info",
    description: "Send your current Spotify track's info to chat",
    displayDescription: "Send your current Spotify track's info to chat",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",
    execute(args, ctx) {
        const track = SpotifyStore.getTrack();
        if (!track) noSpotifySession(ctx);
        const info = [
            `Title: [${track.name}](${track.album.image.url})`,
            `Main artist: [${track.artists[0].name}](${track.artists[0].external_urls.spotify}?si=0)`,
            `Album: [${track.album.name}](https://open.spotify.com/album/${track.album.id}?si=0)`,
            ``,
            `**[Listen to This Track!](https://open.spotify.com/track/${track.id}?si=0)**`
        ];
        return { content: `${info.join('\n')}` };
    }
}));

export const onUnload = () => {
    for (const unregisterCommand of commands) unregisterCommand();
};

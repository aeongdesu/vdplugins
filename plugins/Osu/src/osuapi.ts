import { settings } from "./utils"

/**
 * regex from https://github.com/Fanyatsu/osu-requests-bot/blob/8f0eff8031924e0929b412749b8cb4a6059c4c7b/main.py#L31-L41
 */
const osu_beatmap_patterns = {
    "beatmap_official": /https?:\/\/osu.ppy.sh\/beatmapsets\/[0-9]+\#(osu|taiko|fruits|mania)\/([0-9]+)/,
    "beatmap_old": /https?:\/\/(osu|old).ppy.sh\/b\/([0-9]+)/,
    "beatmap_alternate": /https?:\/\/osu.ppy.sh\/beatmaps\/([0-9]+)/,
    "beatmap_old_alternate": /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?b=([0-9]+)/,
}
const osu_profile_pattern = /https?:\/\/(osu|old).ppy.sh\/(u|users)\/([^\s]+)/

const getToken = async () => {
    if (settings.accessData?.token && settings.accessData?.expires_in > Date.now()) return settings.accessData.token
    const { access_token, expires_in } = await fetch("https://osu.ppy.sh/oauth/token", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            client_id: settings.clientID,
            client_secret: settings.clientSecret,
            grant_type: "client_credentials",
            scope: "public"
        })
    }).then(res => res.json())

    settings.accessData = {
        token: access_token,
        expires_in: (expires_in * 1000) + Date.now()
    }
    return access_token
}

const fetchApi = async (url: string) => await fetch(url, {
    method: "GET",
    headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${await getToken()}`
    }
}).then(res => res.json())

export const getBeatmap = async (beatmap: string) => {
    if (isNaN(parseFloat(beatmap))) {
        for (const pattern in osu_beatmap_patterns) {
            const matches = beatmap.match(osu_beatmap_patterns[pattern])
            if (!matches) continue
            beatmap = matches[matches.length - 1]
        }
    }
    const data = await fetchApi(`https://osu.ppy.sh/api/v2/beatmaps/${beatmap}`)
    if (!data.id) return undefined
    return {
        id: data.id,
        setid: data.beatmapset_id,
        title: data.beatmapset.title,
        artist: data.beatmapset.artist,
        status: data.beatmapset.status,
        version: data.version,
        diffrating: data.difficulty_rating,
        bpm: data.bpm
    }
}

export const getUser = async (user: string) => {
    if (isNaN(parseFloat(user))) {
        const match = user.match(osu_profile_pattern)
        if (match) user = match[match.length - 1]
    }
    const data = await fetchApi(`https://osu.ppy.sh/api/v2/users/${user}`)
    console.log(data)
    if (!data.id) return undefined
    return {
        country_code: data.country_code,
        username: data.username,
        id: data.id,
        rank: data.statistics.global_rank,
        country_rank: data.statistics.country_rank,
        pp: data.statistics.pp
    }
}
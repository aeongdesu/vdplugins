import { settings } from "./utils"
import { findByProps } from "@vendetta/metro"
import { nicething } from "./utils"

let isError = false

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
    const data = await fetch("https://osu.ppy.sh/oauth/token", {
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
    })
    if (!data.ok) return isError = true
    const { access_token, expires_in } = await data.json()

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
        "accept": "application/json",
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
        id: data.id as number,
        setid: data.beatmapset_id as number,
        title: data.beatmapset.title as string,
        artist: data.beatmapset.artist as string,
        status: data.beatmapset.status as string,
        version: data.version as string,
        diffrating: data.difficulty_rating as number,
        bpm: data.bpm as number
    }
}

export const getUser = async (user?: string) => {
    if (!settings.user) return
    if (!user) user = settings.user
    if (isNaN(parseFloat(user))) {
        const match = user.match(osu_profile_pattern)
        if (match) user = match[match.length - 1]
    }
    const data = await fetchApi(`https://osu.ppy.sh/api/v2/users/${user}`)
    if (!data.id) return
    // null horror
    let global_rank: number = data.statistics.global_rank
    let rank_highest: object = data.rank_highest
    let country_rank: number = data.statistics.country_rank
    if (global_rank == null) global_rank = 0
    if (rank_highest == null) rank_highest = { rank: 0, updated_at: "" }
    if (country_rank == null) country_rank = 0

    return {
        active: data.is_active as boolean,
        bot: data.is_bot as boolean,
        deleted: data.is_deleted as boolean,
        online: data.is_online as boolean,
        supporter: data.is_supporter as boolean,
        country_code: data.country_code as string,
        username: data.username as string,
        id: data.id as number,
        join_date: +new Date(data.join_date) / 1000,
        accuracy: data.statistics.hit_accuracy.toFixed(2) as number,
        level: data.statistics.level as { current: number, progress: number },
        playcount: nicething(data.statistics.play_count),
        playtime: nicething(Math.floor(data.statistics.play_time / 3600)),
        rank: nicething(global_rank),
        rank_highest: rank_highest as { rank: number, updated_at: string },
        grades: data.statistics.grade_counts as { a: number, s: number, sh: number, ss: number, ssh: number },
        country_rank: nicething(country_rank),
        pp: data.statistics.pp as string
    }
}
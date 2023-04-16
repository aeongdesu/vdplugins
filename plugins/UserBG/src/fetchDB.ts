export let data: [] | undefined

export const fetchDB = async () => {
    const datab = await fetch("https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json")
    if (!datab.ok) return
    data = await datab.json()
    return data
}
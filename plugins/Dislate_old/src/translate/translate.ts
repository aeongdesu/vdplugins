import { LanguageType, TranslationData } from "../def"

export default async function translate(text: string, { fromLanguage, toLanguage }: LanguageType) {
    const url = "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
        client: "gtx",
        sl: fromLanguage,
        tl: toLanguage,
        dt: "t",
        dj: "1",
        source: "input",
        q: text
    })
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to translate")
    const { src, sentences }: TranslationData = await res.json()
    return {
        src,
        text: sentences.map(s => s?.trans).filter(Boolean).join("")
    }
}
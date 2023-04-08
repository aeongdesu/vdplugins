import { LanguageType } from "../def"

const base = "https://translate.googleapis.com/translate_a/single"
const engine = {
    fetch: ({ from, to, text }) => `${base}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`,
    parse: res => res.json().then(body => {
        body = body && body[0] && body[0][0] && body[0].map(s => s[0]).join("")
        if (!body) throw new Error("Invalid Translation!")
        return body
    })
}

export default async function translate(text: string, { fromLanguage, toLanguage }: LanguageType) {
    const url = engine.fetch({
        text,
        from: fromLanguage,
        to: toLanguage,
    })
    return await fetch(url).then(engine.parse)
}
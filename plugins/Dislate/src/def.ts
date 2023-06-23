export type LanguageType = {
    fromLanguage: string
    toLanguage: string
}

export type SettingsType = {
    DislateLangFrom: string
    DislateLangTo: string
    DislateLangAbbr: boolean
}

export interface TranslationData {
    src: string
    sentences: {
        trans: string
    }[]
}
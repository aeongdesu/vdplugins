// vendetta-type doesnt export them
export enum ApplicationCommandInputType {
    BUILT_IN,
    BUILT_IN_TEXT,
    BUILT_IN_INTEGRATION,
    BOT,
    PLACEHOLDER,
}

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT,
}

export enum ApplicationCommandType {
    CHAT = 1,
    USER,
    MESSAGE,
}

export type LanguageType = {
    fromLanguage: string
    toLanguage: string
}

export type SettingsType = {
    DislateLangFrom: string
    DislateLangTo: string
    DislateLangAbbr: boolean
}
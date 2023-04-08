import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "../../def"
import { registerCommand } from "@vendetta/commands"
import LanguageNames from "../../translate/languages/names"
import { Format } from "../../common"
import ISO from "../../translate/languages/iso"
import { Translate, settings, ClydeUtils } from "../../common"

const languageOptions = LanguageNames.filter((e: string) => e !== 'detect')
    .map((item: string) => ({
        name: Format.string(item),
        displayName: Format.string(item),
        value: item
    }))


export default registerCommand({
    id: "translate",
    name: "translate",
    displayName: "translate",
    description: "Send a message using Dislate in any language chosen, using the Google Translate API.",
    displayDescription: "Send a message using Dislate in any language chosen, using the Google Translate API.",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    options: [
        {
            name: "text",
            displayName: "text",
            description: "The text/message for Dislate to translate. Please note some formatting of mentions and emojis may break due to the API.",
            displayDescription: "The text/message for Dislate to translate. Please note some formatting of mentions and emojis may break due to the API.",
            type: ApplicationCommandOptionType.STRING as number,
            required: true
        },
        {
            name: "language",
            displayName: "language",
            description: "The language that Dislate will translate the text into. This can be any language from the list, except \"Detect\".",
            displayDescription: "The language that Dislate will translate the text into. This can be any language from the list, except \"Detect\".",
            type: ApplicationCommandOptionType.STRING as number,
            // @ts-ignore
            choices: [...languageOptions],
            required: true
        },
    ],

    async execute(args, context) {
        const message = args.find((o: any) => o.name === "text").value
        const language = args.find((o: any) => o.name === "language").value
        const languageMap = Object.assign({}, ...LanguageNames.map((k, i) => ({ [k]: ISO[i] })))

        const translatedContent = await Translate.string(
            message,
            {
                fromLanguage: settings.DislateLangFrom as string,
                toLanguage: language,
            },
            languageMap
        )
        if (!translatedContent) return ClydeUtils.sendBotMessage(context.channel.id, `Failed to translate: ${message}`)
        return { content: translatedContent }
    }
})
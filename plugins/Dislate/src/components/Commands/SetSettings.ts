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
    id: "translate-set",
    name: "translate-set",
    displayName: "translate-set",
    description: "temp",
    displayDescription: "temp",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    options: [
        {
            name: "to",
            displayName: "to",
            description: "to",
            displayDescription: "to",
            type: ApplicationCommandOptionType.STRING as number,
            // @ts-ignore
            choices: [...languageOptions],
            required: true
        },
    ],

    async execute(args, ctx) {
        const to = args.find((o: any) => o.name === "to").value
        settings.DislateLangTo = to
        return ClydeUtils.sendBotMessage(ctx.channel.id, `Saved! \`${settings.DislateLangTo}\``)
    }
})
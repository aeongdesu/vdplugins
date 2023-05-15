import { findByProps } from "@vendetta/metro"
import { instead } from "@vendetta/patcher"
import { registerCommand } from "@vendetta/commands"
import { storage } from "@vendetta/plugin"
import { ApplicationCommandType, ApplicationCommandInputType, ApplicationCommandOptionType } from "../../../ApplicationCommandTypes"

const { default: { setShouldSyncAppearanceSettings }, saveClientTheme } = findByProps("saveClientTheme")

const { getText, setText } = findByProps("getText", "setText")
const ClydeUtils = findByProps("sendBotMessage")
const canUse = findByProps("canUseClientThemes")
const { BackgroundGradientPresetId } = findByProps("BackgroundGradientPresetId")

const clientThemeOptions = Object.keys(BackgroundGradientPresetId).filter((e: any) => isNaN(e))
    .map((item: string, index: number) => ({
        name: item,
        displayName: item,
        value: index
    }))

const patches = [
    instead("canUseClientThemes", canUse, () => true),
    instead("canUsePremiumProfileCustomization", canUse, () => true),
    registerCommand({
        name: "theme change",
        displayName: "theme change",
        description: "test",
        displayDescription: "test",
        options: [{
            name: "theme",
            displayName: "theme",
            description: "dark or light",
            displayDescription: "dark or light",
            type: ApplicationCommandOptionType.STRING as number,
            // @ts-ignore
            choices: [{
                name: "dark",
                displayName: "dark",
                value: "dark"
            },
            {
                name: "light",
                displayName: "light",
                value: "light"
            }]
        },
        {
            name: "background",
            displayName: "background",
            description: "ClientThemes",
            displayDescription: "ClientThemes",
            type: ApplicationCommandOptionType.STRING as number,
            // @ts-ignore
            choices: [...clientThemeOptions]
        }],
        type: ApplicationCommandType.CHAT as number,
        inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
        applicationId: "-1",

        async execute(args, ctx) {
            const theme = args.find((o: any) => o.name === "theme")?.value
            const background = args.find((o: any) => o.name === "background")?.value
            if (!theme && !background) return ClydeUtils.sendBotMessage(ctx.channel.id, "no options?")
            if (background) storage.id = background
            setText("")
            const waitClear = setInterval(() => {
                if (getText().length === 0) {
                    clearInterval(waitClear)
                    setTimeout(() => {
                        saveClientTheme({
                            backgroundGradientPresetId: background,
                            theme: theme
                        })
                        return ClydeUtils.sendBotMessage(ctx.channel.id, "Done!")
                    }, 0)
                }
            }, 0)
        }
    })
]

setShouldSyncAppearanceSettings(false)

export const onUnload = () => {
    for (const unpatch of patches) unpatch()
}

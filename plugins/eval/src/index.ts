interface Script {
    name: string
    code: string
    async?: boolean
}

// um actually this is pylix's code
import { findByProps } from "@vendetta/metro"
import { ApplicationCommandOptionType } from "../../../ApplicationCommandTypes"
import { storage } from "@vendetta/plugin"
import { logger } from "@vendetta"
import { registerCommand } from "../../osu/src/utils" // !!!

const messageUtil = findByProps("sendBotMessage")
const util = findByProps("inspect")
const AsyncFunction = (async () => void 0).constructor

const ZERO_WIDTH_SPACE_CHARACTER = "\u200B"
const wrapInJSCodeblock = (res: string) => "```js\n" + res.replaceAll("`", "`" + ZERO_WIDTH_SPACE_CHARACTER) + "\n```"

const commands = []
storage.scripts ??= [] as Script[]

export const onLoad = async () => {
    if (storage.scripts.length > 0) {
        for (const script of storage.scripts as Script[]) {
            const code = script.code
            const isAsync = script.async ?? false
            try {
                const res = util.inspect(isAsync ? await AsyncFunction(code)() : eval?.(code))
                logger.log(res)
            } catch (err: any) {
                logger.error(err)
            }
        }
    }
}

commands.push(registerCommand({
    name: "eval",
    description: "Evaluate JavaScript code.",
    options: [
        {
            name: "code",
            displayName: "code",
            type: ApplicationCommandOptionType.STRING as number,
            description: "The code to evaluate.",
            displayDescription: "The code to evaluate.",
            required: true
        },
        {
            name: "async",
            displayName: "async",
            type: ApplicationCommandOptionType.BOOLEAN as number,
            description: "Whether to support 'await' in code. Must explicitly return for result (default: false)",
            displayDescription: "Whether to support 'await' in code. Must explicitly return for result (default: false)"
        }
    ],
    async execute([code, async], ctx) {
        try {
            const res = util.inspect(async?.value ? await AsyncFunction(code.value)() : eval?.(code.value))
            const trimmedRes = res.length > 2000 ? res.slice(0, 2000) + "..." : res

            messageUtil.sendBotMessage(ctx.channel.id, wrapInJSCodeblock(trimmedRes))
        } catch (err: any) {
            messageUtil.sendBotMessage(ctx.channel.id, wrapInJSCodeblock(err?.stack ?? err))
        }
    }
}))

commands.push(registerCommand({
    name: "eval save",
    description: "loads script at startup",
    options: [
        {
            name: "code",
            displayName: "code",
            type: ApplicationCommandOptionType.STRING as number,
            description: "The code to save.",
            displayDescription: "The code to save.",
            required: true
        },
        {
            name: "async",
            displayName: "async",
            type: ApplicationCommandOptionType.BOOLEAN as number,
            description: "Whether to support 'await' in code. Must explicitly return for result (default: false)",
            displayDescription: "Whether to support 'await' in code. Must explicitly return for result (default: false)"
        }
    ],
    async execute([code, async], ctx) {
        storage.scripts.push({
            name: makeid(6),
            code: code.value,
            async: async?.value
        })
        return messageUtil.sendBotMessage(ctx.channel.id, "saved")
    }
}))

const options = storage.scripts.map((item: Script) => ({
    name: item.name,
    displayName: item.name,
    value: item.name
}))

commands.push(registerCommand({
    name: "eval delete",
    description: "wow",
    options: [
        {
            name: "script",
            displayName: "script",
            type: ApplicationCommandOptionType.STRING as number,
            description: "guh",
            displayDescription: "guh",
            //@ts-ignore
            choices: [...options],
            required: true
        }
    ],
    async execute([script], ctx) {
        storage.scripts.pop(script.value)
        return messageUtil.sendBotMessage(ctx.channel.id, "deleted")
    }
}))

export const onUnload = () => {
    for (const unregisterCommands of commands) unregisterCommands()
}

const makeid = (length: number) => {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
    }
    return result
}
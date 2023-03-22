// https://github.com/Aliucord/AliucordRN/blob/main/src/core-plugins/CoreCommands.ts
import { registerCommand } from "@vendetta/commands"
import { findByProps } from "@vendetta/metro"

enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER6,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT
}
const makeAsyncEval = (code: string) => {
    return `
    var __async = (generator) => {
        return new Promise((resolve, reject) => {
            var fulfilled = (value) => {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            var rejected = (value) => {
                try {
                    step(generator.throw(value))
                } catch (e) {
                    reject(e)
                }
            }
            var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected)
            step((generator = generator()).next())
        })
    }
    __async(function*() {
        ${code.replace(/\bawait\b/g, "yield")}
    })
    `
}
const codeblock = (code: string) => {
    const ZWSP = "\u200b"
    return "```js\n" + code.replace(/`/g, "`" + ZWSP) + "```"
}

let commands = []
const ClydeUtils = findByProps("sendBotMessage")
const Locale = findByProps("Messages")

commands.push(registerCommand({
    name: "echo",
    displayName: "echo",
    description: "Creates a Clyde message",
    displayDescription: "Creates a Clyde message",
    options: [{
        name: "message",
        displayName: "message",
        description: Locale.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,
        displayDescription: Locale.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,
        required: true,
        // @ts-ignore
        type: ApplicationCommandOptionType.STRING
    }],
    // @ts-ignore
    applicationId: -1,
    inputType: 1,
    type: 1,

    execute: (args, ctx) => ClydeUtils.sendBotMessage(ctx.channel.id, args[0].value)
}))


commands.push(registerCommand({
    name: "eval",
    displayName: "eval",
    description: "token grabber",
    displayDescription: "token grabber",
    options: [{
        name: "code",
        displayName: "code",
        description: "Code to eval. Async functions are not supported. Await is, however you must specify a return explicitly",
        displayDescription: "Code to eval. Async functions are not supported. Await is, however you must specify a return explicitly",
        required: true,
        // @ts-ignore
        type: ApplicationCommandOptionType.STRING
    }],
    // @ts-ignore
    applicationId: -1,
    inputType: 1,
    type: 1,

    execute: async (args, ctx) => {
        try {
            const code = args[0].value as string

            let result
            if (code.includes("await")) {
                result = await (0, eval)(makeAsyncEval(code))
            } else {
                result = (0, eval)(code)
            }

            ClydeUtils.sendBotMessage(ctx.channel.id, codeblock(String(result)))
        } catch (err: any) {
            ClydeUtils.sendBotMessage(ctx.channel.id, codeblock(err?.stack ?? err?.message ?? String(err)))
        }
    },

}))

export const onUnload = () => {
    for (const unregisterCommands of commands) unregisterCommands()
}

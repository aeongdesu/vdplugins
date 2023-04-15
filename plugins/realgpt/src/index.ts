import { registerCommand } from "@vendetta/commands"
import { findByProps } from "@vendetta/metro"
import { plugin } from "@vendetta"
import { stopPlugin } from "@vendetta/plugins"

const { sendBotMessage } = findByProps("sendBotMessage")

export const enum ApplicationCommandInputType {
    BUILT_IN,
    BUILT_IN_TEXT,
    BUILT_IN_INTEGRATION,
    BOT,
    PLACEHOLDER
}

export const enum ApplicationCommandOptionType {
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
    ATTACHMENT
}

export const enum ApplicationCommandType {
    CHAT = 1,
    USER,
    MESSAGE
}

const unregisterCommand = registerCommand({
    name: "realgpt",
    displayName: "realgpt",
    description: "why",
    displayDescription: "why",
    options: [{
        name: "prompt",
        displayName: "prompt",
        description: "self explantory",
        displayDescription: "self explantory",
        type: ApplicationCommandOptionType.STRING as number,
        required: true
    }],
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    applicationId: "-1",

    async execute(args, ctx) {
        // if (!plugin.manifest.authors.find(author => author.id === findByProps("getCurrentUser").getCurrentUser()?.id)) return
        const data = await fetch("https://free.churchless.tech/v1/chat/completions", {
            method: "POST",
            body: JSON.stringify({
                "frequency_penalty": 0,
                "max_tokens": null,
                "model": "gpt-3.5-turbo",
                "presence_penalty": 0,
                "stream": false,
                "temperature": 1,
                "top_p": 1,
                "messages": [{
                    "content": args[0].value,
                    "role": "user"
                }]
            }),
            headers: {
                "content-type": "application/json"
            }
        })
        if (!data.ok) return sendBotMessage(ctx.channel.id, "Failed to fetch data")
        const real = await data.json()
        return sendBotMessage(ctx.channel.id, `> prompt: ${args[0].value}\n> model: \`${real.model}\`\n\n${real.choices[0].message.content}`)
    }
})

export const onUnload = () => unregisterCommand()

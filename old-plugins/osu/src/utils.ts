import { findByProps } from "@vendetta/metro"
import { storage } from "@vendetta/plugin"

const ClydeUtils = findByProps("sendBotMessage")

export const sendBotMessage = (channelID: number, message: string) => ClydeUtils.sendBotMessage(channelID, message)

export const nicething = (number: number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const getOption = (args: any[], name: string) => {
    return args.find(x => x.name == name)?.value
}

type SettingsType = {
    clientID: string,
    clientSecret: string,
    accessData: {
        token: string,
        expires_in: number
    },
    user: string
}

export let settings = storage as SettingsType
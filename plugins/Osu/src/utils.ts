import { findByProps } from "@vendetta/metro"
import { storage } from "@vendetta/plugin"

const ClydeUtils = findByProps("sendBotMessage")

export const sendBotMessage = (channelID: number, message: string) => ClydeUtils.sendBotMessage(channelID, message)

type SettingsType = {
    clientID: string,
    clientSecret: string,
    accessData: {
        token: string,
        expires_in: number
    }
}

export let settings = storage as SettingsType

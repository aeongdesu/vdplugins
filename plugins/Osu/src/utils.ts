import { findByProps } from "@vendetta/metro"
import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"

const ClydeUtils = findByProps("sendBotMessage")

export const sendBotMessage = (channelID: number, message: string) => ClydeUtils.sendBotMessage(channelID, message)

type SettingsType = {
    clientID: number | string,
    clientSecret: string,
    accessData: {
        token: string,
        expires_in: number
    }
}

export const settings = useProxy(storage) as SettingsType

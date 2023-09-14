import { SettingsType } from "../def"
import { storage } from "@vendetta/plugin"

// default settings
storage.DislateLangFrom ??= "detect"
storage.DislateLangTo ??= "english"
storage.DislateLangAbbr ??= false

export let settings = storage as SettingsType
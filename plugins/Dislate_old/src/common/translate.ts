import Translate from "../translate/translate"
import { LanguageType, TranslationData } from "../def"

/**
 * Translates text to a language provided in iso.
 * @param {string} text : The text to translate.
 * @param {string} fromLang : The language to translate from.
 * @param {boolean} cancel : Toggles translation. If false will return untranslated text.
 */
async function translate(text: string, { fromLanguage = "detect", toLanguage = "english" }: LanguageType, languages, cancel?: boolean) {
    const result = await Translate(text, {
        fromLanguage: languages[fromLanguage],
        toLanguage: languages[toLanguage]
    })
    /**
     * Returns the original string early if @arg cancel is @arg true.
     */
    return cancel
        ? text
        : result.text
}

export default { translate }
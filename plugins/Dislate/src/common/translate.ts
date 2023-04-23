import translate from "../translate/translate"
import { LanguageType } from "../def"

/** 
 * Translates text to a language provided in iso.
 * @param {string} text: The text to translate.
 * @param {string} fromLang: The language to translate from.
 * @param {string} toLang: The language to translate to.
 * @param {boolean} cancel: Toggles translation. If false will return untranslated text.
 * @returns {string text}
 */
async function string(text: string, { fromLanguage = "detect", toLanguage = "english" }: LanguageType, languages, cancel?: boolean): Promise<string> {
    /**
     * Returns the original string early if @arg cancel is @arg true.
     */
    return cancel
        ? text
        : await translate(text, {
            fromLanguage: languages[fromLanguage],
            toLanguage: languages[toLanguage]
        })
}

export default { string }
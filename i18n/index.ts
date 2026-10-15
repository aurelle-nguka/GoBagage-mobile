import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'

import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import es from './locales/es.json'
import zh from './locales/zh.json'

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  zh: { translation: zh },
}

const LANGUAGE_KEY = 'gobagage_language'
const supportedLanguages = ['en', 'fr', 'de', 'es', 'zh']
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en'
const defaultLanguage = supportedLanguages.includes(deviceLanguage)
  ? deviceLanguage
  : 'en'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

AsyncStorage.getItem(LANGUAGE_KEY).then((savedLang) => {
  if (savedLang && supportedLanguages.includes(savedLang)) {
    i18n.changeLanguage(savedLang)
  }
})

export async function changeAppLanguage(lang: string) {
  await i18n.changeLanguage(lang)
  await AsyncStorage.setItem(LANGUAGE_KEY, lang)
}

export { supportedLanguages }
export default i18n
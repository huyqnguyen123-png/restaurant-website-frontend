import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import de from './de.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: 'de', // German as the default language, per the restaurant's location
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
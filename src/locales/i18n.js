import i18next from 'i18next'
import en from './en'
import he from './he'

export default i18next.init({
  fallbackLng: 'en',
  lng: 'he',
  debug: false,
  resources: { en, he },
  react: {
    wait: true,
  },
})
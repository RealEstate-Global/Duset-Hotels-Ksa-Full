import { createI18n } from 'vue-i18n'

import commonEn from './locales/en/common.json'
import navEn from './locales/en/nav.json'
import footerEn from './locales/en/footer.json'
import homeEn from './locales/en/home.json'
import aboutEn from './locales/en/about.json'
import roomsEn from './locales/en/rooms.json'
import amenitiesEn from './locales/en/amenities.json'
import galleryEn from './locales/en/gallery.json'
import attractionsEn from './locales/en/attractions.json'
import contactEn from './locales/en/contact.json'
import faqEn from './locales/en/faq.json'
import legalEn from './locales/en/legal.json'
import uiEn from './locales/en/ui.json'
import authEn from './locales/en/auth.json'
import bookingEn from './locales/en/booking.json'
import dashboardEn from './locales/en/dashboard.json'

import commonAr from './locales/ar/common.json'
import navAr from './locales/ar/nav.json'
import footerAr from './locales/ar/footer.json'
import homeAr from './locales/ar/home.json'
import aboutAr from './locales/ar/about.json'
import roomsAr from './locales/ar/rooms.json'
import amenitiesAr from './locales/ar/amenities.json'
import galleryAr from './locales/ar/gallery.json'
import attractionsAr from './locales/ar/attractions.json'
import contactAr from './locales/ar/contact.json'
import faqAr from './locales/ar/faq.json'
import legalAr from './locales/ar/legal.json'
import uiAr from './locales/ar/ui.json'
import authAr from './locales/ar/auth.json'
import bookingAr from './locales/ar/booking.json'
import dashboardAr from './locales/ar/dashboard.json'

export const SUPPORTED_LOCALES = ['en', 'ar'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const STORAGE_KEY = 'duset-lang'

const storedLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'ar' || stored === 'en' ? stored : 'en'
}

export const applyLocaleToDocument = (locale: SupportedLocale) => {
  if (typeof document === 'undefined') return
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: storedLocale(),
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      common: commonEn,
      nav: navEn,
      footer: footerEn,
      home: homeEn,
      about: aboutEn,
      rooms: roomsEn,
      amenities: amenitiesEn,
      gallery: galleryEn,
      attractions: attractionsEn,
      contact: contactEn,
      faq: faqEn,
      legal: legalEn,
      ui: uiEn,
      auth: authEn,
      booking: bookingEn,
      dashboard: dashboardEn,
    },
    ar: {
      common: commonAr,
      nav: navAr,
      footer: footerAr,
      home: homeAr,
      about: aboutAr,
      rooms: roomsAr,
      amenities: amenitiesAr,
      gallery: galleryAr,
      attractions: attractionsAr,
      contact: contactAr,
      faq: faqAr,
      legal: legalAr,
      ui: uiAr,
      auth: authAr,
      booking: bookingAr,
      dashboard: dashboardAr,
    },
  },
})

export const setLocale = (locale: SupportedLocale) => {
  i18n.global.locale.value = locale
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, locale)
  }
  applyLocaleToDocument(locale)
}

// Ensure <html lang/dir> matches the initial locale before the app mounts.
applyLocaleToDocument(storedLocale())

export default i18n

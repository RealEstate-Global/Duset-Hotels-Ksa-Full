import { createI18n } from 'vue-i18n'
import fs from 'node:fs'

const namespaces = ['common', 'nav', 'footer', 'home', 'about', 'rooms', 'amenities', 'gallery', 'attractions', 'contact', 'faq', 'legal', 'ui', 'auth', 'booking', 'dashboard']
const locales = ['en', 'ar']
const messages = {}
for (const lang of locales) {
  messages[lang] = {}
  for (const ns of namespaces) {
    messages[lang][ns] = JSON.parse(
      fs.readFileSync(`./src/i18n/locales/${lang}/${ns}.json`, 'utf8'),
    )
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages,
})

const collectKeys = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key
    if (Array.isArray(value)) {
      return value.flatMap((item, index) =>
        typeof item === 'object' && item !== null
          ? collectKeys(item, `${full}[${index}]`)
          : [`${full}[${index}]`],
      )
    }
    if (value && typeof value === 'object') return collectKeys(value, full)
    return [full]
  })

let failures = 0
for (const lang of locales) {
  for (const ns of namespaces) {
    if (ns === 'legal') continue // legal documents render via raw interpolation, never through the message compiler
    for (const key of collectKeys(messages[lang][ns], ns)) {
      try {
        i18n.global.locale.value = lang
        i18n.global.t(key)
      } catch (error) {
        failures++
        console.log(`FAIL [${lang}] ${key}: ${error.message.split('\n')[0]}`)
      }
    }
  }
}
console.log(failures === 0 ? '\nALL MESSAGES COMPILE OK' : `\n${failures} message(s) failed`)
process.exit(failures === 0 ? 0 : 1)

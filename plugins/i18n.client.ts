import { watch } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as any

  // Set initial direction
  const html = document.documentElement
  const currentLocale = i18n.locale.value
  html.setAttribute('dir', currentLocale === 'ar' ? 'rtl' : 'ltr')
  html.setAttribute('lang', currentLocale)

  // Watch for locale changes
  watch(() => i18n.locale.value, (newLocale) => {
    html.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr')
    html.setAttribute('lang', newLocale)
  })
})


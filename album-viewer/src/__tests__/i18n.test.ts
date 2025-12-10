import { describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import de from '../locales/de.json'

describe('i18n translations', () => {
  it('should load all language files', () => {
    expect(en).toBeDefined()
    expect(fr).toBeDefined()
    expect(de).toBeDefined()
  })

  it('should have consistent keys across all languages', () => {
    const enKeys = JSON.stringify(Object.keys(en).sort())
    const frKeys = JSON.stringify(Object.keys(fr).sort())
    const deKeys = JSON.stringify(Object.keys(de).sort())

    expect(enKeys).toBe(frKeys)
    expect(enKeys).toBe(deKeys)
  })

  it('should create i18n instance with all languages', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      messages: { en, fr, de }
    })

    expect(i18n.global.availableLocales).toContain('en')
    expect(i18n.global.availableLocales).toContain('fr')
    expect(i18n.global.availableLocales).toContain('de')
  })

  it('should translate header title correctly', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: { en, fr, de }
    })

    const { t } = i18n.global

    expect(t('header.title')).toBe('Album Collection')
  })

  it('should switch languages correctly', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: { en, fr, de }
    })

    const { t, locale } = i18n.global

    // English
    expect(t('header.title')).toBe('Album Collection')

    // French
    locale.value = 'fr'
    expect(t('header.title')).toBe('Collection d\'Albums')

    // German
    locale.value = 'de'
    expect(t('header.title')).toBe('Album-Sammlung')
  })

  it('should have all required translation keys', () => {
    const requiredKeys = [
      'header.title',
      'header.subtitle',
      'loading.message',
      'error.message',
      'error.retry',
      'album.addToCart',
      'album.preview',
      'language.select'
    ]

    requiredKeys.forEach(key => {
      const keys = key.split('.')
      
      // Check English
      let enValue: any = en
      keys.forEach(k => { enValue = enValue[k] })
      expect(enValue).toBeDefined()
      expect(typeof enValue).toBe('string')

      // Check French
      let frValue: any = fr
      keys.forEach(k => { frValue = frValue[k] })
      expect(frValue).toBeDefined()
      expect(typeof frValue).toBe('string')

      // Check German
      let deValue: any = de
      keys.forEach(k => { deValue = deValue[k] })
      expect(deValue).toBeDefined()
      expect(typeof deValue).toBe('string')
    })
  })
})

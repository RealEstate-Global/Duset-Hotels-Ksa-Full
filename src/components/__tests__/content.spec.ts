import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import SectionHeading from '../common/SectionHeading.vue'
import { rooms } from '../../features/rooms/data/rooms'
import { amenities, coreFeatures } from '../../data/amenities'
import { attractions } from '../../data/attractions'
import { galleryCategories } from '../../data/gallery'

const localeFile = (lang: string, ns: string) =>
  JSON.parse(
    readFileSync(resolve(process.cwd(), `src/i18n/locales/${lang}/${ns}.json`), 'utf-8'),
  ) as Record<string, unknown>

const namespaces = [
  'common',
  'nav',
  'footer',
  'home',
  'about',
  'rooms',
  'amenities',
  'gallery',
  'attractions',
  'contact',
  'faq',
  'legal',
  'ui',
  'auth',
  'booking',
  'dashboard',
]

const keyPaths = (value: unknown, prefix = ''): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => keyPaths(item, `${prefix}[${index}]`))
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

describe('locale parity (en vs ar)', () => {
  it.each(namespaces)('namespace %s has identical key shapes in English and Arabic', (ns) => {
    const en = localeFile('en', ns)
    const ar = localeFile('ar', ns)
    expect(keyPaths(ar).sort()).toEqual(keyPaths(en).sort())
  })
})

describe('SectionHeading', () => {
  it('renders the eyebrow and title', () => {
    const wrapper = mount(SectionHeading, {
      props: { eyebrow: 'Rooms & Suites', title: 'Luxury rooms, made for you.' },
    })

    expect(wrapper.text()).toContain('Rooms & Suites')
    expect(wrapper.text()).toContain('Luxury rooms, made for you.')
  })
})

describe('rooms data', () => {
  it('lists the four Duset room types with unique slugs', () => {
    expect(rooms).toHaveLength(4)
    expect(new Set(rooms.map((room) => room.slug)).size).toBe(4)
    for (const room of rooms) {
      expect(room.image).toMatch(/^\/images\/uploads\//)
      expect(room.gallery.length).toBeGreaterThan(0)
    }
  })

  it('has a locale entry for every room in both languages', () => {
    const enRooms = localeFile('en', 'rooms') as { list: Record<string, unknown> }
    const arRooms = localeFile('ar', 'rooms') as { list: Record<string, unknown> }
    for (const room of rooms) {
      expect(enRooms.list[room.id], `en rooms.list.${room.id}`).toBeTruthy()
      expect(arRooms.list[room.id], `ar rooms.list.${room.id}`).toBeTruthy()
    }
  })

  it('points every referenced image at an existing file in public/', () => {
    const publicDir = resolve(process.cwd(), 'public')
    for (const room of rooms) {
      for (const image of [room.image, ...room.gallery]) {
        expect(() => readFileSync(resolve(publicDir, `.${image}`))).not.toThrow()
      }
    }
  })
})

describe('content completeness', () => {
  it('ships the 10 FAQ entries from the site in both languages', () => {
    for (const lang of ['en', 'ar']) {
      const faq = localeFile(lang, 'faq') as { items: unknown[] }
      expect(faq.items).toHaveLength(10)
    }
  })

  it('ships all 19 amenities with existing local icons', () => {
    expect(amenities.length).toBe(19)
    const publicDir = resolve(process.cwd(), 'public')
    for (const amenity of [...amenities, ...coreFeatures]) {
      expect(() => readFileSync(resolve(publicDir, `.${amenity.icon}`))).not.toThrow()
      const enAmenities = localeFile('en', 'amenities') as { items: Record<string, string> }
      const arAmenities = localeFile('ar', 'amenities') as { items: Record<string, string> }
      expect(enAmenities.items[amenity.key]).toBeTruthy()
      expect(arAmenities.items[amenity.key]).toBeTruthy()
    }
  })

  it('ships the 9 attractions and a key for each', () => {
    expect(attractions.length).toBe(9)
    expect(attractions.map((attraction) => attraction.key)).toContain('cenomiMall')
    const en = localeFile('en', 'attractions') as { items: Record<string, string> }
    const ar = localeFile('ar', 'attractions') as { items: Record<string, string> }
    for (const attraction of attractions) {
      expect(en.items[attraction.key]).toBeTruthy()
      expect(ar.items[attraction.key]).toBeTruthy()
    }
  })

  it('ships all gallery photos with existing local files', () => {
    const publicDir = resolve(process.cwd(), 'public')
    const en = localeFile('en', 'gallery') as { categories: Record<string, string> }
    const ar = localeFile('ar', 'gallery') as { categories: Record<string, string> }
    for (const category of galleryCategories) {
      expect(category.images.length).toBeGreaterThan(0)
      expect(en.categories[category.id]).toBeTruthy()
      expect(ar.categories[category.id]).toBeTruthy()
      for (const image of category.images) {
        expect(() => readFileSync(resolve(publicDir, `.${image}`))).not.toThrow()
      }
    }
  })

  it('ships the three legal documents in both languages', () => {
    for (const lang of ['en', 'ar']) {
      const legal = localeFile(lang, 'legal') as Record<string, unknown>
      for (const docKey of ['privacy-policy', 'refund-policy', 'terms-and-conditions']) {
        expect(legal[docKey], `${lang} legal.${docKey}`).toBeTruthy()
      }
    }
  })
})

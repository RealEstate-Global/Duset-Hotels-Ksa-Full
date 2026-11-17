import type { Room } from '../types/room.types'

const img = (file: string) => `/images/uploads/538/${file}`

/**
 * Room content (names, descriptions, tags) lives in src/i18n/locales/{en,ar}/rooms.json —
 * components render text via `$t('rooms.list.<id>.name')` etc.
 */
export const rooms: Room[] = [
  {
    id: 'deluxe-room',
    slug: 'deluxe-room',
    image: img('3203_duset_hotel_suites__11_.webp'),
    gallery: [
      img('3203_402duset_hotel_suites__9_.webp'),
      img('3203_872duset_hotel_suites__10_.webp'),
      img('3203_158duset_hotel_suites__11_.webp'),
      img('3203_35duset_hotel_suites__12_.webp'),
      img('3203_105duset_hotel_suites__13_.webp'),
    ],
  },
  {
    id: 'one-bed-room-apartment',
    slug: 'one-bed-room-apartment',
    image: img('3203_duset_hotel_suites__28_.webp'),
    gallery: [
      img('3203_168duset_hotel_suites__27_.webp'),
      img('3203_46duset_hotel_suites__28_.webp'),
      img('3203_108duset_hotel_suites__29_.webp'),
    ],
  },
  {
    id: 'executive-two-bed-room',
    slug: 'excutive-two-bed-room',
    image: img('3203_duset_hotel_suites__23_.webp'),
    gallery: [
      img('3203_616duset_hotel_suites__22_.webp'),
      img('3203_138duset_hotel_suites__23_.webp'),
      img('3203_110duset_hotel_suites__24_.webp'),
      img('3203_671duset_hotel_suites__25_.webp'),
    ],
  },
  {
    id: 'deluxe-two-bed-room',
    slug: 'deluxe-two-bed-room',
    image: img('3203_duset_hotel_suites__16_.webp'),
    gallery: [
      img('3203_33duset_hotel_suites__14_.webp'),
      img('3203_546duset_hotel_suites__15_.webp'),
      img('3203_654duset_hotel_suites__16_.webp'),
      img('3203_367duset_hotel_suites__17_.webp'),
      img('3203_395duset_hotel_suites__18_.webp'),
      img('3203_34duset_hotel_suites__19_.webp'),
      img('3203_119duset_hotel_suites__20_.webp'),
      img('3203_315duset_hotel_suites__21_.webp'),
    ],
  },
]

export const getRoomBySlug = (slug: string | string[] | undefined) =>
  rooms.find((room) => room.slug === slug)

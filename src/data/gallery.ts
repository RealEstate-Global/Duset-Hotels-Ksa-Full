export interface GalleryCategory {
  id: string
  images: string[]
}

const img = (file: string) => `/images/uploads/538/${file}`

/** Category labels live in src/i18n/locales/{en,ar}/gallery.json under gallery.categories.<id>. */
export const galleryCategories: GalleryCategory[] = [
  {
    id: 'interior-exterior',
    images: [
      img('3203_695duset_hotel_suites__31_.webp'),
      img('3203_969duset_hotel_suites__32_.webp'),
      img('3203_544duset_hotel_suites__33_.webp'),
      img('3203_569duset_hotel_suites__34_.webp'),
      img('3203_513duset_hotel_suites__35_.webp'),
      img('3203_589duset_hotel_suites__36_.webp'),
      img('3203_207duset_hotel_suites__37_.webp'),
      img('3203_85duset_hotel_suites__38_.webp'),
      img('3203_642duset_hotel_suites__39_.webp'),
      img('3203_282duset_hotel_suites__42_.webp'),
    ],
  },
  {
    id: 'deluxe-room',
    images: [
      img('3203_280duset_hotel_suites__9_.webp'),
      img('3203_739duset_hotel_suites__10_.webp'),
      img('3203_581duset_hotel_suites__11_.webp'),
      img('3203_129duset_hotel_suites__12_.webp'),
      img('3203_415duset_hotel_suites__13_.webp'),
    ],
  },
  {
    id: 'one-bed-room-apartment',
    images: [
      img('3203_503duset_hotel_suites__27_.webp'),
      img('3203_924duset_hotel_suites__28_.webp'),
      img('3203_676duset_hotel_suites__29_.webp'),
    ],
  },
  {
    id: 'executive-two-bed-room',
    images: [
      img('3203_454duset_hotel_suites__22_.webp'),
      img('3203_8duset_hotel_suites__23_.webp'),
      img('3203_602duset_hotel_suites__24_.webp'),
      img('3203_181duset_hotel_suites__25_.webp'),
    ],
  },
  {
    id: 'deluxe-two-bed-room',
    images: [
      img('3203_391duset_hotel_suites__14_.webp'),
      img('3203_805duset_hotel_suites__15_.webp'),
      img('3203_272duset_hotel_suites__16_.webp'),
      img('3203_950duset_hotel_suites__17_.webp'),
      img('3203_492duset_hotel_suites__18_.webp'),
      img('3203_509duset_hotel_suites__19_.webp'),
      img('3203_34duset_hotel_suites__20_.webp'),
      img('3203_20duset_hotel_suites__21_.webp'),
    ],
  },
]

export interface Attraction {
  key: string
  image: string
  mapsUrl?: string
}

export const attractions: Attraction[] = [
  {
    // The live site's image (uploads/7/314room1.jpg) is broken (404) — using a local Duset Hotel Suites asset instead.
    key: 'dumasaqqs',
    image: '/images/uploads/538/3203_99duset_hotel_suites__47_.webp',
  },
  {
    key: 'cenomiMall',
    image: '/images/uploads/538/459al_nakheel_mall.webp',
    mapsUrl: 'https://maps.app.goo.gl/8fQgofZCATpnmw4u6',
  },
  {
    key: 'alhammadiHospital',
    image: '/images/uploads/538/652duset_hotel_suites__2_.webp',
    mapsUrl: 'https://maps.app.goo.gl/jS5Txhxgq2rdNFKq5',
  },
  {
    key: 'manuelMarket',
    image: '/images/uploads/538/439duset_hotel_suites__3_.webp',
    mapsUrl: 'https://maps.app.goo.gl/z5D9UBCeAem4WAxf9',
  },
  {
    key: 'riyadhExhibitionCentre',
    image: '/images/uploads/538/160duset_hotel_suites__4_.webp',
    mapsUrl: 'https://maps.app.goo.gl/zv9zBGvAEZnRqMmU6',
  },
  {
    key: 'tamimmiMarket',
    image: '/images/uploads/538/786tamimi_market.webp',
    mapsUrl: 'https://maps.app.goo.gl/xqFE77yKuAAJ7PjZ9',
  },
  {
    key: 'garanadaMall',
    image: '/images/uploads/538/908duset_hotel_suites__6_.webp',
    mapsUrl: 'https://maps.app.goo.gl/escLvQEAEVRboj6D7',
  },
  {
    key: 'panoramaMall',
    image: '/images/uploads/538/427duset_hotel_suites__7_.webp',
    mapsUrl: 'https://maps.app.goo.gl/epJwSAJzGJrWHjAc6',
  },
  {
    key: 'ministerOfEducation',
    image: '/images/uploads/538/189duset_hotel_suites__8_.webp',
    mapsUrl: 'https://maps.app.goo.gl/LFPzgVgBB322dJ4PA',
  },
]

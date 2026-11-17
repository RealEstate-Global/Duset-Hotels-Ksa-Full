# Duset Hotel Suites — Official Website

Production-ready Vue 3 SPA for **Duset Hotel Suites**, 71 luxury rooms with 24hrs service in the heart of Riyadh, Saudi Arabia. Rebuilt from `dusethotels.com` — brand, content, images and links are all sourced from the live site.

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript**
- **TailwindCSS 3** + PostCSS + Autoprefixer
- **Vue Router** with lazy-loaded routes and per-route SEO meta (via `ui.meta.*` i18n keys)
- **Vue I18n** (`src/i18n`) — full English/Arabic (RTL) support, toggle `EN` / `ع` in the navbar
- **Vite 7** build, **vitest** unit tests (locale parity + content integrity)
- **lucide-vue-next** icon set (note: pinned version is deprecated upstream — migrate to `@lucide/vue` when convenient)

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server
npm run build      # type-check + production build
npm run preview    # preview production build
npm run test:unit  # run unit tests
npm run type-check # vue-tsc
npm run lint       # eslint --fix
npm run check:i18n # verify every i18n message compiles (pipes/linked-format bugs)
```

## Internationalization (EN / AR)

All user-facing strings live in `src/i18n/locales/{en,ar}/<namespace>.json` — never inline in templates.
Namespaces: `common` (brand + actions), `nav`, `footer`, `home`, `about`, `rooms`, `amenities`, `gallery`,
`attractions`, `contact`, `faq`, `legal` (full privacy/refund/terms documents), `ui` (cookie consent, WhatsApp
chat, scroll-top, 404, error boundary, route meta). Components use `useI18n()` and `$t()` / `tm()`; structured
arrays (faqs, rooms, services…) are read via `tm()`.

Language toggle (`EN` / `ع`) is in the navbar and mobile drawer. Choice persists in `localStorage`
(`duset-lang`); `<html lang/dir>` is set pre-paint in `index.html` and by `setLocale()` (Arabic → `dir="rtl"`,
Cairo font, RTL-mirrored directional icons via `.icon-flip`).

**Gotcha:** `\|` is the plural separator in vue-i18n message strings — never put a raw pipe in locale values
(use `·`). A raw pipe silently truncates the string after it.

## Interactive widgets & features

- `src/components/common/CookieConsent.vue` — bottom-center banner, fade/slide-up after 3s if no stored
  consent. Consent is written to `localStorage` (`duset-cookie-consent`) **and** a cookie
  (`duset_cookie_consent`) **and** `sessionStorage`.
- `src/components/common/ScrollToTop.vue` — appears after 320px with an SVG scroll-progress ring,
  smooth-scrolls to top.
- `src/components/common/WhatsAppChat.vue` — floating WhatsApp button (bottom-right) with expandable
  chat card, online indicator, quick-action chips, compose bar opening wa.me deep links.
- `src/components/booking/BookingWidget.vue` — home hero booking bar (room + dates + guests → `/booking`).
- **In-repo booking engine** (`/booking`) — 3 steps (room & dates → guest details → review), SAR pricing
  with VAT 15%, promo codes (`DUSET10`, `DUSET15`), validation, localStorage persistence.
- **Auth** (`/`) — avatar in navbar toggles a responsive Sign In / Register modal (demo: `demo@duset.com` / `demo123`),
  routes into the dashboard.
- **Dashboard** (`/dashboard/*`, auth-guarded) — dark sidebar layout (swipe-in drawer on mobile) with
  Overview (stats, loyalty tier progress, next-stay card), My Bookings (tabbed, cancellable), Booking detail
  (ICS export), Payments (saved cards, add/remove/default), Profile (edit, preferences, language, reset demo data).
- Footer pins to the bottom of the viewport/body at all screen sizes (flex column layout).

## Structure

```
src/
├── App.vue / main.ts          # app shell + entry
├── assets/main.css            # Tailwind layers + Duset design tokens (emerald + charcoal)
├── components/
│   ├── common/                # SectionHeading, LegalDocument
│   ├── layout/                # NavBar (with top contact bar), SiteFooter
│   └── sections/              # Hero (slider), RoomsSection, ServicesSection, FacilitiesSection,
│                              # HowItWorks (booking), Testimonials, FaqSection, AttractionsGrid
├── constants/                 # site.ts (brand, contacts, socials, booking URLs), routes.ts
├── data/                      # faqs, amenities, attractions, testimonials, gallery, legal (policies)
├── features/rooms/            # room types, data (4 room types w/ live booking deep-links), RoomCard
├── layouts/DefaultLayout.vue
├── pages/                     # Home, About, Rooms, RoomDetail, Amenities, Gallery, Attractions,
│                              # Contact, FAQ, Privacy/Refund/Terms, NotFound
├── router/                    # all routes + SEO meta
└── composables/useTheme.ts    # light/dark (localStorage: duset-theme)
```

## Content & Data Sources

Everything on the site is real content pulled from <https://dusethotels.com>:

- **Book Now** → <https://live.ipms247.com/booking/roomlist-aldusetsuites-be> (per-room deep links on room pages)
- **Contact**: 00966112261111 · 00966502261111 · duset.hotel@gmail.com
- **Address**: 12473, Saudi Arabia, Riyadh, Nuzha District, Prince Muqrin Bin Abdelaziz St, No 3216
- **Social**: Facebook · Instagram ([@duset.hotel](https://www.instagram.com/duset.hotel/)) · Tripadvisor (5.0, 2000+ reviews) · WhatsApp wa.me/+966112261111
- **Images**: downloaded locally into `public/images/uploads/...` from dusethotels.com

## Notes

- `Dumasaqqs` attraction image on the live site 404s; a local Duset Hotel Suites exterior is used instead — replace with your own Diriyah photo in `src/data/attractions.ts`.
- Booking is handled by the hotel's IPMS engine (Yanolja Cloud Solution); no booking form is faked in-app.

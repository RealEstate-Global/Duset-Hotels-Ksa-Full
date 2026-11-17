# Duset Hotel Suites — Website

Production Vue 3 SPA for **Duset Hotel Suites** (71 luxury rooms, 24hrs service, Riyadh). Content is sourced from <https://dusethotels.com> — the owner of this repo also owns that site.

## Tech Stack

- **Frontend**: Vue 3.5 + Composition API (`<script setup>`) + TypeScript
- **Styling**: TailwindCSS 3 (`tailwind.config.js`, content: `index.html`, `src/**/*`)
- **Routing**: Vue Router 4, hash-free history, per-route `meta.title`/`meta.description`
- **State**: none needed (favorites store was removed) — content lives in `src/data/` and `src/constants/site.ts`
- **Testing**: Vitest + Vue Test Utils (`npm run test:unit`)
- **Build**: Vite 7 — `npm run build` runs `vue-tsc` then `vite build`
- **Lint/Format**: ESLint 9 + Prettier

## Project Structure

```
src/
├── App.vue                  # shell + onErrorCaptured fallback + locale↔title sync
├── assets/main.css          # Tailwind layers + CSS variables + RTL/Arabic rules
├── components/
│   ├── common/              # SectionHeading, LegalDocument, CookieConsent, ScrollToTop, WhatsAppChat
│   ├── layout/              # NavBar.vue (top contact bar + drawer + EN/ع toggle), SiteFooter.vue
│   └── sections/            # HeroSection (auto-advancing slider), RoomsSection, ServicesSection,
│                            # FacilitiesSection, HowItWorksSection, TestimonialsSection,
│                            # FaqSection, AttractionsGrid
├── constants/site.ts        # SINGLE SOURCE OF TRUTH: name, phones, email, address, socials,
│                            # bookingUrl, mapsUrl, whatsapp, copyright
├── constants/routes.ts      # ROUTES constants
├── data/                    # amenities.ts, attractions.ts, gallery.ts (structure only)
├── features/rooms/          # types, data/rooms.ts (structure only; text via i18n), RoomCard
├── i18n/                    # index.ts (setLocale/applyLocaleToDocument) + locales/{en,ar}/*.json
├── layouts/DefaultLayout.vue # flex column, footer pinned bottom, mounts widgets
├── pages/                   # Home, About, Rooms, RoomDetail, Amenities, Gallery, Attractions,
│                            # Contact, Faq, PrivacyPolicy, RefundPolicy, Terms, NotFound
├── router/index.ts          # lazy routes (home static) + afterEach sets title/description via i18n
└── composables/useTheme.ts  # light/dark toggle, storage key: duset-theme
```

## Internationalization

- Locales: `en`, `ar` (full RTL). Strings never inline in components — use `$t`/`tm` with keys in
  `src/i18n/locales/<lang>/<namespace>.json` (namespaces: common, nav, footer, home, about, rooms,
  amenities, gallery, attractions, contact, faq, legal, ui, auth, booking, dashboard).
- Language toggle cycles `en` ↔ `ar`, persisted as `duset-lang` in localStorage; `<html lang/dir>` set pre-paint.
- Structured content (arrays of objects) via `tm()` + `computed`; plain strings via `t()`.
- **Never use a raw `|` or bare `@` in locale strings** (vue-i18n plural separator / linked-format tokens).
  Escape literal emails as `you{'@'}example.com`. `npm run check:i18n` verifies every message compiles.
- Arabic font: Cairo (loaded in index.html); `html[lang="ar"]` swaps body/display font; `[dir="rtl"]`
  zeroes letter-spacing and mirrors `.icon-flip` icons.
- Route meta title/description come from `ui.meta.*` and update on language toggle (App.vue watcher) and navigation.
- Test suite enforces en/ar key parity and data↔locale integrity (`content.spec.ts`).

## Auth, booking & dashboard

- `useAuth` (`src/features/auth/useAuth.ts`) — reactive auth state persisted in `duset-auth`; demo account
  `demo@duset.com` / `demo123` (any valid email + 6+ char password works); avatar in navbar opens Sign In/Register
  modal (`AuthModal.vue`); dashboard routes are nested under `/dashboard` with `meta: { layout: 'dashboard', requiresAuth: true }`
  and an auth guard that bounces anonymous visitors to `/?auth=required` (opens the modal automatically).
- `useBookingStore` (`src/features/booking/booking.store.ts`) — module-level reactive store persisted in
  `duset-bookings` / `duset-payments` / `duset-prefs`; seeds 3 demo bookings + 1 Visa card on first run;
  SAR pricing with VAT 15% and promo codes (`DUSET10`, `DUSET15`).
- Dashboard pages live in `src/pages/dashboard/`; chrome (dark sidebar, notifications bell, user menu) in
  `src/layouts/DashboardLayout.vue`; booking flow in `src/pages/booking/`; shared booking widget in
  `src/components/booking/BookingWidget.vue`.
- `App.vue` switches between `DefaultLayout` and `DashboardLayout` via `route.meta.layout`.

## Brand & Content Rules

- **Brand name**: "Duset Hotel Suites" (never "Harthouse"; it was fully removed).
- **Booking** always links to the IPMS engine: `https://live.ipms247.com/booking/roomlist-aldusetsuites-be`
  (room-level: `roomwisedata.php?...&roomtypeunkid=<id>` in `src/features/rooms/data/rooms.ts`).
- **Contact data** must come from `src/constants/site.ts` — do not hardcode phone/email/address elsewhere.
- **Images** are local, in `public/images/uploads/...`, downloaded from dusethotels.com. Keep them local; do not hotlink (except Google Maps embeds).
- Room slugs intentionally match the live site's URLs (e.g. `excutive-two-bed-room`).
- The live site is trilingual (EN/AR/ES); this SPA is English-first with Arabic room names and FAQ answers where the source provides them.

## Conventions

- Use Tailwind utilities + the design tokens in `main.css` (`--accent` emerald, `--primary` charcoal, `container-shell`, `eyebrow`, `display-title`, `link-underline`).
- Eyebrow/title markup pattern: `<p class="eyebrow">` then `<h1|h2 class="display-title text-h1|h2">`.
- Accents on fixed-dark scrims use `.text-on-dark-accent`; accents on theme-inverting `bg-primary` sections use `.text-inverse-accent` / `.eyebrow-inverse`.
- All pages start at `pt-[68px] md:pt-[104px]` (fixed header: 68px bar, +36px contact strip on md+).
- External links: `target="_blank" rel="noopener noreferrer"`.
- No fake forms: the only newsletter form is UX-only; booking is external by design.
- Floating widgets (cookie banner, scroll-to-top, WhatsApp chat) live in `DefaultLayout.vue` — do not mount them per-page.
- Footer “Powered by” text is `footer.poweredBy` + `SITE.poweredBy` (RealEstate-Global).
- Cookie consent: never bypass `localStorage`/`sessionStorage`/cookie written by `CookieConsent.vue`; it also gates the 3s delayed banner for new visitors.

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUpRight, Check, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { SITE } from '@/constants/site'

const email = ref('')
const submitted = ref(false)
const { t } = useI18n()

const subscribe = () => {
  if (!email.value.trim()) return
  submitted.value = true
}
</script>

<template>
  <footer id="contact" class="border-t border-border bg-primary text-primary-foreground">
    <div class="container-shell py-16 sm:py-20">
      <div class="grid gap-14 lg:grid-cols-[1.35fr_1fr_1fr_1.35fr] lg:gap-10">
        <div>
          <RouterLink to="/" class="inline-flex items-center" :aria-label="t('nav.homeAria')">
            <img
              src="/images/uploads/logos/3203_duset_hotel_suites_logo.webp"
              alt="Duset Hotel Suites"
              class="h-14 w-auto rounded-lg bg-white/95 p-1.5"
            />
          </RouterLink>
          <p class="mt-6 max-w-xs text-sm leading-7 text-primary-foreground/60">
            {{ t('footer.tagline') }}
          </p>
          <div class="mt-8 flex gap-2">
            <a
              :href="SITE.social.facebook"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t('footer.socialFacebook')"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/15 transition hover:bg-primary-foreground/10"
              ><Facebook :size="16"
            /></a>
            <a
              :href="SITE.social.instagram"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t('footer.socialInstagram')"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/15 transition hover:bg-primary-foreground/10"
              ><Instagram :size="16"
            /></a>
            <a
              :href="SITE.social.tripadvisor"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t('footer.socialTripadvisor')"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/15 transition hover:bg-primary-foreground/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-4 w-4"
                role="img"
                aria-hidden="true"
              >
                <path
                  d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.083-1.6l2.02 2.02 2.02-2.02a5.976 5.976 0 0 0 4.085 1.6 5.997 5.997 0 0 0 4.04-10.43L24 6.649h-4.36a13.573 13.573 0 0 0-7.634-2.354zM6.003 10.1c2.578 0 4.666 2.088 4.666 4.665 0 2.578-2.088 4.666-4.666 4.666A4.667 4.667 0 0 1 1.34 14.765 4.667 4.667 0 0 1 6.003 10.1zm11.994 0c2.578 0 4.664 2.088 4.664 4.665a4.667 4.667 0 0 1-9.332 0c0-2.577 2.09-4.665 4.668-4.665zm0 2.333a2.332 2.332 0 1 0 0 4.665 2.332 2.332 0 0 0 0-4.665zM6.003 12.43a2.333 2.333 0 1 0 0 4.665 2.333 2.333 0 0 0 0-4.665z"
                />
              </svg>
            </a>
            <a
              :href="SITE.whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t('footer.socialWhatsapp')"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/15 transition hover:bg-primary-foreground/10"
              ><MessageCircle :size="16"
            /></a>
            <a
              :href="SITE.emailHref"
              :aria-label="t('footer.socialEmail')"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/15 transition hover:bg-primary-foreground/10"
              ><Mail :size="16"
            /></a>
          </div>
        </div>
        <div>
          <p class="eyebrow text-primary-foreground/50">{{ t('footer.explore') }}</p>
          <nav class="mt-6 flex flex-col gap-4 text-sm text-primary-foreground/70" :aria-label="t('footer.explore')">
            <RouterLink to="/rooms" class="transition hover:text-primary-foreground">{{ t('footer.exploreLinks.rooms') }}</RouterLink>
            <RouterLink to="/amenities" class="transition hover:text-primary-foreground">{{ t('footer.exploreLinks.amenities') }}</RouterLink>
            <RouterLink to="/gallery" class="transition hover:text-primary-foreground">{{ t('footer.exploreLinks.gallery') }}</RouterLink>
            <RouterLink to="/attractions" class="transition hover:text-primary-foreground">{{ t('footer.exploreLinks.attractions') }}</RouterLink>
            <RouterLink to="/about" class="transition hover:text-primary-foreground">{{ t('footer.exploreLinks.about') }}</RouterLink>
            <RouterLink to="/faq" class="transition hover:text-primary-foreground">{{ t('footer.exploreLinks.faq') }}</RouterLink>
          </nav>
        </div>
        <div>
          <p class="eyebrow text-primary-foreground/50">{{ t('footer.getInTouch') }}</p>
          <div class="mt-6 space-y-4 text-sm leading-6 text-primary-foreground/70">
            <div>
              <a
                v-for="phone in SITE.phones"
                :key="phone.href"
                :href="phone.href"
                class="flex items-center gap-2 transition hover:text-primary-foreground"
              >
                <Phone :size="13" class="shrink-0" /> {{ phone.display }}
              </a>
            </div>
            <a
              :href="SITE.emailHref"
              class="flex items-center gap-2 transition hover:text-primary-foreground"
            >
              <Mail :size="13" class="shrink-0" /> {{ SITE.email }}
            </a>
            <p class="flex items-start gap-2">
              <MapPin :size="13" class="mt-1 shrink-0" />
              <span>{{ SITE.address }}</span>
            </p>
          </div>
        </div>
        <div>
          <p class="eyebrow text-primary-foreground/50">{{ t('footer.bookYourStay') }}</p>
          <h3 class="mt-5 font-display text-2xl font-semibold tracking-[-0.04em]" v-html="t('footer.bookHeading')" />
          <p class="mt-3 text-sm leading-6 text-primary-foreground/60">
            {{ t('footer.bookBody') }}
          </p>
          <RouterLink
            to="/booking"
            class="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
          >
            {{ t('common.actions.bookNow') }} <ArrowUpRight :size="15" class="icon-flip" />
          </RouterLink>
          <form class="mt-8 flex border-b border-primary-foreground/20 pb-3" @submit.prevent="subscribe">
            <label :for="'newsletter-email'" class="sr-only">{{ t('footer.newsletterLabel') }}</label>
            <input
              id="newsletter-email"
              v-model="email"
              type="email"
              required
              :placeholder="t('footer.newsletterPlaceholder')"
              class="min-w-0 flex-1 bg-transparent text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/45"
            />
            <button
              type="submit"
              :aria-label="t('footer.newsletterSubmit')"
              class="text-accent transition hover:text-primary-foreground"
            >
              <Check v-if="submitted" :size="19" /><ArrowUpRight v-else :size="19" />
            </button>
          </form>
          <p class="mt-2 text-xs text-primary-foreground/45">
            {{ submitted ? t('footer.subscribed') : t('footer.newsletterNote') }}
          </p>
        </div>
      </div>
      <div
        class="mt-16 flex flex-col justify-between gap-4 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/45 sm:flex-row"
      >
        <p class="flex flex-wrap items-center gap-x-2">
          <span>{{ t('footer.copyright') }}</span>
          <span class="hidden text-primary-foreground/25 sm:inline" aria-hidden="true">·</span>
          <span class="inline-flex items-center gap-1.5 text-accent/80">
            <Sparkles :size="12" aria-hidden="true" /> {{ t('footer.madeWithPride') }}
          </span>
        </p>
        <p class="self-center">
          {{ t('footer.poweredBy') }}
          <a
            :href="SITE.poweredByUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold underline decoration-accent/50 underline-offset-2 transition hover:text-primary-foreground"
            >{{ SITE.poweredBy }}</a
          >
        </p>
        <div class="flex flex-wrap gap-5">
          <RouterLink to="/privacy-policy" class="transition hover:text-primary-foreground">{{ t('footer.privacyPolicy') }}</RouterLink>
          <RouterLink to="/refund-policy" class="transition hover:text-primary-foreground">{{ t('footer.refundPolicy') }}</RouterLink>
          <RouterLink to="/terms-and-conditions" class="transition hover:text-primary-foreground">{{ t('footer.terms') }}</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

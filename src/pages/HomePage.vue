<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { ArrowUpRight, BedDouble, Building2, Clock3, Star, Wifi, MapPin } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import HeroSection from '@/components/sections/HeroSection.vue'

// Below-the-fold sections are code-split out of the initial bundle to keep
// the critical path (hero + booking bar) light. They load right after mount.
const RoomsSection = defineAsyncComponent(() => import('@/components/sections/RoomsSection.vue'))
const ServicesSection = defineAsyncComponent(() => import('@/components/sections/ServicesSection.vue'))
const FacilitiesSection = defineAsyncComponent(() => import('@/components/sections/FacilitiesSection.vue'))
const HowItWorksSection = defineAsyncComponent(() => import('@/components/sections/HowItWorksSection.vue'))
const TestimonialsSection = defineAsyncComponent(() => import('@/components/sections/TestimonialsSection.vue'))
const FaqSection = defineAsyncComponent(() => import('@/components/sections/FaqSection.vue'))
const AttractionsGrid = defineAsyncComponent(() => import('@/components/sections/AttractionsGrid.vue'))

const { t, tm } = useI18n()

const highlightIcons = [MapPin, BedDouble, Wifi, Clock3]

interface Stat {
  value: string
  suffix: string
  label: string
}
interface Highlight {
  title: string
  copy: string
}

const stats = computed(() => tm('home.stats') as unknown as Stat[])
const highlights = computed(() =>
  (tm('home.whyDuset.highlights') as unknown as Highlight[]).map((highlight, index) => ({
    ...highlight,
    icon: highlightIcons[index],
  })),
)
</script>

<template>
  <main>
    <HeroSection />

    <section aria-label="Duset Hotel Suites at a glance" class="border-b border-border/70 bg-secondary/35">
      <div class="container-shell py-6 sm:py-8">
        <div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" class="bg-secondary/60 px-5 py-8 sm:px-7 sm:py-9">
            <p class="font-display text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              {{ stat.value }}<span v-if="stat.suffix" class="text-xl text-accent">{{ stat.suffix }}</span>
            </p>
            <p class="mt-2 max-w-[140px] text-xs leading-5 text-muted-foreground">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-border/70 py-20 sm:py-24">
      <div class="container-shell grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div class="relative order-2 lg:order-1">
          <div
            class="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
            aria-hidden="true"
          />
          <div class="relative aspect-[1/1] overflow-hidden rounded-2xl">
            <img
              src="/images/uploads/538/8787duset_hotel_suites__39_.webp"
              :alt="t('home.aboutPreview.imageAlt')"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              class="absolute left-5 top-5 rounded-full bg-background/90 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-foreground shadow-float backdrop-blur"
            >
              {{ t('home.aboutPreview.badge') }}
            </div>
          </div>
        </div>
        <div class="order-1 lg:order-2 lg:pl-6">
          <p class="eyebrow">{{ t('home.aboutPreview.eyebrow') }}</p>
          <h2 class="display-title mt-4 text-h2" v-html="t('home.aboutPreview.title')" />
          <p class="mt-6 max-w-md text-body-md text-muted-foreground">
            {{ t('home.aboutPreview.copy') }}
          </p>
          <RouterLink
            to="/about"
            class="link-underline mt-8 inline-flex items-center gap-2 text-sm font-bold"
            >{{ t('home.aboutPreview.link') }} <ArrowUpRight :size="16" class="icon-flip"
          /></RouterLink>
        </div>
      </div>
    </section>

    <RoomsSection />
    <ServicesSection />
    <FacilitiesSection />

    <section class="border-b border-border/70 bg-secondary/35 py-20 sm:py-24">
      <div class="container-shell grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div class="lg:pr-6">
          <p class="eyebrow">{{ t('home.whyDuset.eyebrow') }}</p>
          <h2 class="display-title mt-4 text-h2" v-html="t('home.whyDuset.title')" />
          <p class="mt-6 max-w-md text-body-md text-muted-foreground">
            {{ t('home.whyDuset.copy') }}
          </p>
          <div class="mt-9 grid gap-x-6 gap-y-7 sm:grid-cols-2">
            <div v-for="highlight in highlights" :key="highlight.title" class="flex gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
                ><component :is="highlight.icon" :size="17" :stroke-width="1.8"
              /></span>
              <div>
                <h3 class="font-display text-sm font-bold tracking-[-0.02em]">
                  {{ highlight.title }}
                </h3>
                <p class="mt-1 text-xs leading-5 text-muted-foreground">{{ highlight.copy }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="relative aspect-[1.1/1] overflow-hidden rounded-2xl">
          <img
            src="/images/uploads/538/7162duset_hotel_suites__17_.webp"
            :alt="t('home.whyDuset.imageAlt')"
            class="h-full w-full object-cover"
            loading="lazy"
          />
          <div
            class="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-bold text-white backdrop-blur"
          >
            <Star :size="13" class="text-on-dark-accent" :fill="'currentColor'" /> {{ t('home.whyDuset.imageBadge') }}
          </div>
        </div>
      </div>
    </section>

    <HowItWorksSection />
    <TestimonialsSection />

    <section class="container-shell py-20 sm:py-24">
      <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p class="eyebrow">{{ t('home.attractionsPreview.eyebrow') }}</p>
          <h2 class="display-title mt-4 text-h2" v-html="t('home.attractionsPreview.title')" />
        </div>
        <RouterLink
          to="/attractions"
          class="link-underline inline-flex items-center gap-2 self-start text-sm font-bold sm:mb-1"
          >{{ t('home.attractionsPreview.link') }} <ArrowUpRight :size="16" class="icon-flip"
        /></RouterLink>
      </div>
      <p class="mt-6 max-w-lg text-body-md text-muted-foreground">
        {{ t('home.attractionsPreview.copy') }}
      </p>
      <div class="mt-12">
        <AttractionsGrid :limit="6" />
      </div>
    </section>

    <FaqSection :limit="4" />

    <section class="container-shell py-20 sm:py-24">
      <div
        class="relative overflow-hidden rounded-[2rem] bg-accent px-7 py-14 text-center text-accent-foreground sm:px-12 sm:py-20"
      >
        <div
          class="absolute -left-16 -top-20 h-64 w-64 rounded-full border border-accent-foreground/10"
          aria-hidden="true"
        />
        <div
          class="absolute -bottom-28 -right-12 h-72 w-72 rounded-full border border-accent-foreground/10"
          aria-hidden="true"
        />
        <Building2 :size="28" class="mx-auto opacity-80" />
        <h2 class="display-title relative mt-5 text-h2" v-html="t('home.cta.title')" />
        <p class="relative mx-auto mt-5 max-w-md text-sm leading-6 text-accent-foreground/80">
          {{ t('home.cta.copy') }}
        </p>
        <RouterLink
          to="/booking"
          class="relative mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition hover:-translate-y-1 hover:shadow-float"
          >{{ t('common.actions.bookNow') }} <ArrowUpRight :size="16" class="icon-flip"
        /></RouterLink>
      </div>
    </section>
  </main>
</template>

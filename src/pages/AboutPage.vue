<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Star } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/common/SectionHeading.vue'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import FacilitiesSection from '@/components/sections/FacilitiesSection.vue'
import { coreFeatures } from '@/data/amenities'
import { SITE } from '@/constants/site'

const { t, tm } = useI18n()
const heroStats = computed(() => tm('about.stats') as unknown as { value: string; label: string }[])
</script>

<template>
  <main class="pb-0 pt-[68px] md:pt-[104px]">
    <AppPageHeader :eyebrow="t('about.eyebrow')" :title="t('about.title')">
      <template #actions>
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-background text-accent"
          ><Star :size="16" class="fill-accent" /></span
        ><span class="max-w-[180px] text-xs leading-4 text-muted-foreground">{{ t('about.ratingLabel', { rating: SITE.tripadvisorRating, reviews: SITE.tripadvisorReviews }) }}</span>
      </template>
    </AppPageHeader>

    <section class="container-shell grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_1fr]">
      <div>
        <SectionHeading :eyebrow="t('about.findBest')" :title="t('about.heading')" />
        <div class="mt-6 max-w-lg text-body-md text-muted-foreground">
          <p>{{ t('about.copy') }}</p>
        </div>
        <div class="mt-10 grid grid-cols-2 gap-6 border-y border-border py-8 sm:grid-cols-4">
          <div v-for="stat in heroStats" :key="stat.label">
            <p class="font-display text-2xl font-semibold tracking-[-0.05em]">{{ stat.value }}</p>
            <p class="mt-1 text-[11px] leading-4 text-muted-foreground">{{ stat.label }}</p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <img
          src="/images/uploads/538/8852duset_hotel_suites__39_.webp"
          :alt="t('about.exteriorAlt')"
          class="col-span-2 h-64 w-full rounded-2xl object-cover sm:h-80"
          loading="lazy"
        />
        <img
          src="/images/uploads/538/2518duset_hotel_suites__14_.webp"
          :alt="t('about.facilitiesAlt')"
          class="h-40 w-full rounded-2xl object-cover sm:h-48"
          loading="lazy"
        />
        <img
          src="/images/uploads/538/6022duset_hotel_suites__199_.webp"
          :alt="t('about.roomsAlt')"
          class="h-40 w-full rounded-2xl object-cover sm:h-48"
          loading="lazy"
        />
      </div>
    </section>

    <section class="border-y border-border/70 bg-secondary/35 py-16 sm:py-20">
      <div class="container-shell grid gap-10 md:grid-cols-2">
        <div class="rounded-2xl border border-border/70 bg-card p-8">
          <p class="eyebrow">{{ t('about.mission') }}</p>
          <p class="mt-4 font-display text-2xl font-semibold leading-snug tracking-[-0.03em]">
            {{ t('about.missionText') }}
          </p>
        </div>
        <div class="rounded-2xl border border-border/70 bg-card p-8">
          <p class="eyebrow">{{ t('about.vision') }}</p>
          <p class="mt-4 font-display text-2xl font-semibold leading-snug tracking-[-0.03em]">
            {{ t('about.visionText') }}
          </p>
        </div>
      </div>
    </section>

    <FacilitiesSection />

    <section class="container-shell py-20 sm:py-24">
      <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          :eyebrow="t('about.coreIncluded')"
          :title="t('about.coreTitle')"
          :description="t('about.coreSubline')"
        />
        <RouterLink
          to="/amenities"
          class="link-underline inline-flex items-center gap-2 self-start text-sm font-bold sm:mb-1"
          >{{ t('about.exploreAmenities') }} <ArrowUpRight :size="16" class="icon-flip"
        /></RouterLink>
      </div>
      <div class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="feature in coreFeatures"
          :key="feature.key"
          class="flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-card"
        >
          <img :src="feature.icon" :alt="t(`amenities.items.${feature.key}`)" class="h-14 w-14 object-contain dark:invert" loading="lazy" />
          <p class="text-xs font-bold text-foreground/85">{{ t(`amenities.items.${feature.key}`) }}</p>
        </div>
      </div>
    </section>

    <section class="container-shell pb-20 sm:pb-24">
      <div
        class="flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-primary px-7 py-12 text-center text-primary-foreground sm:flex-row sm:text-left"
      >
        <div>
          <h2 class="font-display text-2xl font-semibold tracking-[-0.04em]">
            {{ t('about.experienceTitle') }}
          </h2>
          <p class="mt-2 max-w-md text-sm leading-6 text-primary-foreground/65">
            {{ t('about.experienceCopy') }}
          </p>
        </div>
        <RouterLink
          to="/booking"
          class="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-bold text-accent-foreground transition hover:-translate-y-1 hover:shadow-float"
          >{{ t('common.actions.bookNow') }} <ArrowUpRight :size="16" class="icon-flip"
        /></RouterLink>
      </div>
    </section>
  </main>
</template>

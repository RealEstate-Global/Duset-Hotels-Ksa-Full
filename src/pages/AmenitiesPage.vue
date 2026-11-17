<script setup lang="ts">
import { Sparkles, Waves, ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { amenities } from '@/data/amenities'

const { t } = useI18n()
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <section class="border-b border-border/70 bg-secondary/40 py-16 sm:py-20">
      <div class="container-shell flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <p class="eyebrow">{{ t('amenities.eyebrow') }}</p>
          <h1 class="display-title mt-4 text-h1" v-html="t('amenities.title')" />
        </div>
        <p class="flex max-w-sm items-start gap-3 text-body-md text-muted-foreground">
          <Sparkles :size="18" class="mt-0.5 shrink-0 text-accent" />
          {{ t('amenities.subline') }}
        </p>
      </div>
    </section>

    <section class="container-shell pt-14">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        <div
          v-for="amenity in amenities"
          :key="amenity.key"
          class="group flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-card"
        >
          <span
            class="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/60 transition duration-300 group-hover:scale-105"
          >
            <img :src="amenity.icon" :alt="t(`amenities.items.${amenity.key}`)" class="h-12 w-12 object-contain dark:invert" loading="lazy" />
          </span>
          <p class="text-sm font-bold text-foreground/85">{{ t(`amenities.items.${amenity.key}`) }}</p>
        </div>
        <RouterLink
          to="/rooms"
          class="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-accent p-7 text-center text-accent-foreground transition duration-300 hover:-translate-y-1 hover:shadow-card"
        >
          <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-foreground/10 transition duration-300 group-hover:scale-105">
            <Waves :size="36" :stroke-width="1.6" />
          </span>
          <p class="font-display text-lg font-semibold leading-snug tracking-[-0.02em]">
            {{ t('amenities.pools.title') }}
          </p>
          <p class="text-xs font-semibold leading-5 text-accent-foreground/85">
            {{ t('amenities.pools.body') }}
          </p>
          <span class="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">
            {{ t('amenities.pools.cta') }} <ArrowRight :size="12" class="icon-flip" />
          </span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

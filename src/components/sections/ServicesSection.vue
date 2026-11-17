<script setup lang="ts">
import { computed } from 'vue'
import { Coffee, ConciergeBell, DoorOpen, Flower2, Sofa, UtensilsCrossed } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const icons = [DoorOpen, UtensilsCrossed, ConciergeBell, Coffee, Flower2, Sofa]
const images = [
  '/images/uploads/538/3580duset_hotel_suites__37_.webp',
  '/images/uploads/538/8819duset_hotel_suites__36_.webp',
  '/images/uploads/538/4383duset_hotel_suites__42_.webp',
  '/images/uploads/538/7446duset_hotel_suites__31_.webp',
  '/images/uploads/538/5529duset_hotel_suites__38_.webp',
  '/images/uploads/538/2018duset_hotel_suites__18_.webp',
]

interface ServiceItem {
  name: string
  alt: string
}

const services = computed(() =>
  (tm('home.services.items') as unknown as ServiceItem[]).map((item, index) => ({
    ...item,
    icon: icons[index],
    image: images[index],
  })),
)
</script>

<template>
  <section id="services" class="border-y border-border/70 bg-primary py-20 text-primary-foreground sm:py-28">
    <div class="container-shell">
      <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p class="eyebrow-inverse">{{ t('home.services.eyebrow') }}</p>
          <h2 class="display-title mt-4 max-w-2xl text-h2" v-html="t('home.services.title')" />
        </div>
        <p class="max-w-sm text-body-md text-primary-foreground/65">
          {{ t('home.services.subline') }}
        </p>
      </div>
      <div class="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
        <figure
          v-for="service in services"
          :key="service.name"
          class="group relative overflow-hidden rounded-2xl"
        >
          <img
            :src="service.image"
            :alt="service.alt"
            class="aspect-[4/5] w-full object-cover transition duration-700 ease-premium group-hover:scale-105"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"
            aria-hidden="true"
          />
          <figcaption
            class="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-4 sm:p-5"
          >
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
              ><component :is="service.icon" :size="16" :stroke-width="1.8"
            /></span>
            <span class="font-display text-sm font-semibold tracking-[-0.02em] text-white sm:text-base">{{
              service.name
            }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

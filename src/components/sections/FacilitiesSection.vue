<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const facilities = computed(() => tm('home.facilities.items') as unknown as string[])
const facilityImages = computed(
  () =>
    (tm('home.facilities.images') as unknown as { alt: string }[]).map((item, index) => ({
      alt: item.alt,
      src: [
        '/images/uploads/538/2518duset_hotel_suites__14_.webp',
        '/images/uploads/538/3460duset_hotel_suites__15_.webp',
        '/images/uploads/538/3187duset_hotel_suites__16_.webp',
      ][index],
    })),
)
</script>

<template>
  <section id="facilities" class="border-b border-border/70 bg-secondary/35 py-20 sm:py-28">
    <div class="container-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div class="order-2 grid grid-cols-2 gap-4 lg:order-1">
        <img
          :src="facilityImages[0]?.src"
          :alt="facilityImages[0]?.alt"
          class="col-span-2 h-56 w-full rounded-2xl object-cover sm:h-72"
          loading="lazy"
        />
        <img
          :src="facilityImages[1]?.src"
          :alt="facilityImages[1]?.alt"
          class="h-40 w-full rounded-2xl object-cover sm:h-48"
          loading="lazy"
        />
        <img
          :src="facilityImages[2]?.src"
          :alt="facilityImages[2]?.alt"
          class="h-40 w-full rounded-2xl object-cover sm:h-48"
          loading="lazy"
        />
      </div>
      <div class="order-1 lg:order-2">
        <p class="eyebrow">{{ t('home.facilities.eyebrow') }}</p>
        <h2 class="display-title mt-4 text-h2" v-html="t('home.facilities.title')" />
        <p class="mt-6 max-w-md text-body-md text-muted-foreground">
          {{ t('home.facilities.copy') }}
        </p>
        <ul class="mt-8 grid gap-3 sm:grid-cols-2">
          <li
            v-for="facility in facilities"
            :key="facility"
            class="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-accent/40"
          >
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"
              ><Check :size="14" :stroke-width="3"
            /></span>
            {{ facility }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

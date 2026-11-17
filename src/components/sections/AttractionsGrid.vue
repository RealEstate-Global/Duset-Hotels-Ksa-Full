<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { attractions } from '@/data/attractions'

withDefaults(defineProps<{ limit?: number }>(), { limit: 9 })
const { t } = useI18n()

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/uploads/538/3203_458duset_hotel_suites__43_.webp'
  }
}
</script>

<template>
  <div class="grid grid-cols-3 gap-3 sm:gap-5">
    <component
      :is="attraction.mapsUrl ? 'a' : 'div'"
      v-for="attraction in attractions.slice(0, limit)"
      :key="attraction.key"
      v-bind="
        attraction.mapsUrl
          ? { href: attraction.mapsUrl, target: '_blank', rel: 'noopener noreferrer' }
          : {}
      "
      class="group relative overflow-hidden rounded-2xl border border-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      :aria-label="
        attraction.mapsUrl ? t('attractions.openInMaps', { name: t(`attractions.items.${attraction.key}`) }) : t(`attractions.items.${attraction.key}`)
      "
    >
      <img
        :src="attraction.image"
        :alt="t(`attractions.items.${attraction.key}`)"
        class="aspect-[4/5] w-full object-cover transition duration-700 ease-premium group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
        aria-hidden="true"
      />
      <div class="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3 sm:p-4">
        <span class="font-display text-[10px] font-semibold leading-tight text-white sm:text-xs lg:text-sm">{{
          t(`attractions.items.${attraction.key}`)
        }}</span>
        <ArrowUpRight
          v-if="attraction.mapsUrl"
          :size="16"
          class="icon-flip shrink-0 text-white/70 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
        />
      </div>
    </component>
  </div>
</template>

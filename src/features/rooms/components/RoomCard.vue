<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { coreFeatures } from '@/data/amenities'
import type { Room } from '../types/room.types'

const props = defineProps<{ room: Room }>()
const { t, tm } = useI18n()

interface RoomListEntry {
  name: string
  otherName: string
  tagline: string
  description: string
  tags: string[]
}
const content = computed(() => tm(`rooms.list.${props.room.id}`) as unknown as RoomListEntry)
</script>

<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card transition duration-500 ease-premium hover:-translate-y-1 hover:shadow-card-hover"
  >
    <RouterLink
      :to="`/rooms/${room.slug}`"
      class="relative block aspect-[1.35/1] overflow-hidden"
      :aria-label="t('rooms.room.viewAria', { name: content.name })"
    >
      <img
        :src="room.image"
        :alt="content.name"
        class="h-full w-full object-cover transition duration-700 ease-premium group-hover:scale-105"
        loading="lazy"
      />
      <span
        class="absolute left-4 top-4 rounded-full border border-white/30 bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur"
        >{{ content.tagline }}</span
      >
    </RouterLink>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <p class="text-caption font-bold uppercase text-muted-foreground">{{ content.otherName }}</p>
      <h3 class="mt-1.5 font-display text-2xl font-semibold tracking-[-0.04em]">
        {{ content.name }}
      </h3>
      <p class="mt-3 text-sm leading-6 text-muted-foreground">{{ content.description }}</p>

      <ul class="mt-4 flex flex-wrap gap-1.5">
        <li
          v-for="tag in content.tags"
          :key="tag"
          class="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground"
        >
          {{ tag }}
        </li>
      </ul>

      <div class="mt-auto pt-5">
        <div class="flex items-center gap-3 border-t border-border pt-4 sm:gap-4">
          <img
            v-for="feature in coreFeatures.slice(0, 5)"
            :key="feature.key"
            :src="feature.icon"
            :alt="t(`amenities.items.${feature.key}`)"
            :title="t(`amenities.items.${feature.key}`)"
            class="h-5 w-5 object-contain dark:invert opacity-80 lg:h-6 lg:w-6"
            loading="lazy"
          />
          <span
            class="ml-auto flex items-center gap-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground"
            :title="t('common.status.twentyFourSeven')"
            ><span class="h-2 w-2 rounded-full bg-accent" /> 24h</span
          >
        </div>

        <div class="mt-4 flex items-center gap-2">
        <RouterLink
          :to="{ path: '/booking', query: { room: room.id } }"
          class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-float"
        >
          {{ t('common.actions.bookNow') }} <ArrowUpRight :size="15" class="icon-flip" />
        </RouterLink>
        <RouterLink
          :to="`/rooms/${room.slug}`"
          class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
          :aria-label="t('rooms.room.seeDetails', { name: content.name })"
        >
          <ArrowRight :size="17" class="icon-flip" />
        </RouterLink>
      </div>
      </div>
    </div>
  </article>
</template>

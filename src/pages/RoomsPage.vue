<script setup lang="ts">
import RoomCard from '@/features/rooms/components/RoomCard.vue'
import { coreFeatures } from '@/data/amenities'
import { rooms } from '@/features/rooms/data/rooms'
import { useI18n } from 'vue-i18n'
import AppPageHeader from '@/components/common/AppPageHeader.vue'

const { t } = useI18n()
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <AppPageHeader
      :eyebrow="t('rooms.pageEyebrow')"
      :title="t('rooms.pageTitle')"
      :description="t('rooms.pageSubline')"
    />

    <section class="container-shell pt-14">
      <div class="grid gap-6 sm:grid-cols-2 xl:gap-8">
        <RoomCard v-for="room in rooms" :key="room.id" :room="room" />
      </div>

      <div class="mt-16 rounded-2xl border border-border/70 bg-secondary/35 p-7 sm:p-10">
        <p class="eyebrow">{{ t('rooms.everyRoomIncludes') }}</p>
        <div class="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          <div v-for="feature in coreFeatures" :key="feature.key" class="flex flex-col items-center gap-2 text-center">
            <img :src="feature.icon" :alt="t(`amenities.items.${feature.key}`)" class="h-12 w-12 object-contain dark:invert" loading="lazy" />
            <span class="text-[11px] font-semibold leading-4 text-foreground/80">{{ t(`amenities.items.${feature.key}`) }}</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

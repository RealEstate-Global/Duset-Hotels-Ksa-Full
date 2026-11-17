<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/common/SectionHeading.vue'
import RoomCard from '@/features/rooms/components/RoomCard.vue'
import { rooms } from '@/features/rooms/data/rooms'

const { t } = useI18n()
</script>

<template>
  <section id="rooms" class="container-shell py-20 sm:py-28">
    <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <SectionHeading :eyebrow="t('rooms.eyebrow')" :title="t('rooms.title')" /><RouterLink
        to="/rooms"
        class="link-underline group inline-flex items-center gap-2 self-start pb-1 text-sm font-bold sm:mb-1"
        ><span>{{ t('rooms.viewAllRooms') }}</span
        ><ArrowUpRight
          :size="16"
          class="icon-flip transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      /></RouterLink>
    </div>
    <div class="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <RoomCard v-for="room in rooms" :key="room.id" :room="room" />
    </div>
  </section>
</template>

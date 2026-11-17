<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Check,
  ConciergeBell,
  Phone,
  MapPin,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import RoomCard from '@/features/rooms/components/RoomCard.vue'
import { getRoomBySlug, rooms } from '@/features/rooms/data/rooms'
import { coreFeatures } from '@/data/amenities'
import { SITE } from '@/constants/site'

const route = useRoute()
const router = useRouter()
const { t, tm } = useI18n()
const activeImage = ref(0)

const room = computed(() => getRoomBySlug(route.params.slug))
const gallery = computed(() => room.value?.gallery ?? [])
const otherRooms = computed(() => rooms.filter((item) => item.id !== room.value?.id))

interface RoomListEntry {
  name: string
  otherName: string
  tagline: string
  description: string
  tags: string[]
}
const content = computed<RoomListEntry | null>(() =>
  room.value
    ? (tm(`rooms.list.${room.value.id}`) as unknown as RoomListEntry)
    : null,
)
const points = computed(() => tm('rooms.room.points') as unknown as string[])

const updateMeta = () => {
  if (!content.value || !room.value) return
  document.title = `${content.value.name} — ${SITE.name}`
  document.querySelector('meta[name="description"]')?.setAttribute('content', content.value.description)
}

const goToImage = (index: number) => {
  if (!gallery.value.length) return
  activeImage.value = (index + gallery.value.length) % gallery.value.length
}

onMounted(() => {
  if (!room.value) router.replace({ name: 'rooms' })
  updateMeta()
})
watch(content, updateMeta)
</script>

<template>
  <main v-if="room && content" class="pb-24 pt-[68px] md:pt-[104px]">
    <section class="container-shell pt-10 sm:pt-14">
      <RouterLink
        to="/rooms"
        class="link-underline inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground"
        ><ArrowLeft :size="14" class="icon-flip" /> {{ t('rooms.room.backToRooms') }}</RouterLink
      >
      <div class="mt-8 flex flex-col justify-between gap-7 md:flex-row md:items-end">
        <div>
          <p class="text-caption font-bold uppercase text-accent">{{ content.otherName }}</p>
          <h1 class="display-title mt-3 text-h1">{{ content.name }}</h1>
          <p class="mt-4 flex items-center gap-2 text-body-md text-muted-foreground">
            <MapPin :size="16" class="text-accent" />{{ SITE.name }} · Nuzha District, Riyadh
          </p>
        </div>
        <RouterLink
          :to="{ path: '/booking', query: { room: room.id } }"
          class="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-bold text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
          >{{ t('common.actions.bookNow') }} <ArrowUpRight :size="16" class="icon-flip"
        /></RouterLink>
      </div>
    </section>

    <section class="container-shell mt-10 sm:mt-14">
      <div class="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div
          class="relative min-h-[320px] overflow-hidden rounded-2xl bg-secondary sm:min-h-[440px] lg:min-h-[560px]"
        >
          <Transition name="gallery-fade" mode="out-in">
            <img
              :key="gallery[activeImage] ?? room.image"
              :src="gallery[activeImage] ?? room.image"
              :alt="`${content.name} view ${activeImage + 1}`"
              class="h-full w-full object-cover"
            />
          </Transition>
          <div
            class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-5 pt-20"
          >
            <span
              class="rounded-full border border-white/25 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur"
              >{{ activeImage + 1 }} / {{ gallery.length }}</span
            >
            <div class="flex gap-2">
              <button
                class="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-float transition hover:-translate-y-0.5 hover:bg-background"
                :aria-label="t('rooms.room.prevImage')"
                @click="goToImage(activeImage - 1)"
              >
                <ArrowLeft :size="16" class="icon-flip" /></button
              ><button
                class="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-float transition hover:-translate-y-0.5 hover:bg-background"
                :aria-label="t('rooms.room.nextImage')"
                @click="goToImage(activeImage + 1)"
              >
                <ArrowRight :size="16" class="icon-flip" />
              </button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 lg:grid-cols-2">
          <button
            v-for="(image, index) in gallery.slice(1, 7)"
            :key="image"
            class="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-float lg:aspect-auto lg:min-h-[168px]"
            :aria-label="t('rooms.room.showImage', { index: index + 2 })"
            @click="goToImage(index + 1)"
          >
            <img
              :src="image"
              :alt="`${content.name} detail ${index + 2}`"
              class="h-full w-full object-cover transition duration-700 ease-premium group-hover:scale-105"
              loading="lazy"
            />
          </button>
        </div>
      </div>
    </section>

    <section class="container-shell mt-14 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
      <div>
        <p class="eyebrow">{{ t('rooms.room.overview') }}</p>
        <h2 class="display-title mt-4 text-h2" v-html="t('rooms.room.relaxTitle')" />
        <p class="mt-6 max-w-2xl text-body-lg text-muted-foreground">{{ content.description }}</p>

        <div class="mt-10 flex flex-wrap gap-4">
          <div class="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-semibold">
            <BedDouble :size="18" class="text-accent" />{{ content.tagline }}
          </div>
          <div class="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-semibold">
            <ConciergeBell :size="18" class="text-accent" />{{ t('common.status.twentyFourSeven') }}
          </div>
        </div>

        <p class="eyebrow mt-12">{{ t('rooms.room.features') }}</p>
        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            v-for="feature in coreFeatures"
            :key="feature.key"
            class="flex flex-col items-center gap-2.5 rounded-xl border border-border/70 bg-secondary/30 p-4 text-center transition duration-300 hover:-translate-y-0.5 hover:border-accent/35"
          >
            <img :src="feature.icon" :alt="t(`amenities.items.${feature.key}`)" class="h-11 w-11 object-contain dark:invert" loading="lazy" />
            <span class="text-[11px] font-semibold leading-4 text-foreground/85">{{ t(`amenities.items.${feature.key}`) }}</span>
          </div>
        </div>
      </div>

      <aside class="lg:sticky lg:top-28 lg:self-start">
        <div class="rounded-2xl border border-border/80 bg-card p-6 shadow-card sm:p-7">
          <p class="text-caption font-bold uppercase text-muted-foreground">{{ t('rooms.room.reserveThisRoom') }}</p>
          <h2 class="mt-3 font-display text-2xl font-semibold tracking-[-0.04em]">
            {{ t('rooms.room.bookRoom', { name: content.name }) }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">
            {{ t('rooms.room.reserveBody') }}
          </p>
          <RouterLink
            :to="{ path: '/booking', query: { room: room.id } }"
            class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-sm font-bold text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
          >
            {{ t('common.actions.bookNow') }} <ArrowUpRight :size="16" class="icon-flip" />
          </RouterLink>
          <ul class="mt-6 space-y-2.5 text-sm text-muted-foreground">
            <li v-for="point in points" :key="point" class="flex items-start gap-2">
              <Check :size="16" class="mt-0.5 shrink-0 text-accent" />{{ point }}
            </li>
          </ul>
          <div class="mt-6 border-t border-border pt-5">
            <p class="text-caption font-bold uppercase text-muted-foreground">{{ t('rooms.room.needHelp') }}</p>
            <a
              :href="SITE.phones[0].href"
              class="mt-3 flex items-center gap-3 font-display text-lg font-semibold tracking-[-0.03em] transition hover:text-accent"
            >
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Phone :size="16" />
              </span>
              {{ SITE.phones[0].display }}
            </a>
          </div>
        </div>
      </aside>
    </section>

    <section class="container-shell mt-20 border-t border-border pt-16">
      <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p class="eyebrow">{{ t('rooms.room.otherRooms') }}</p>
          <h2 class="display-title mt-4 text-h2" v-html="t('rooms.room.otherRoomsTitle')" />
        </div>
        <RouterLink
          to="/rooms"
          class="link-underline inline-flex items-center gap-2 self-start text-sm font-bold sm:mb-1"
          >{{ t('rooms.viewAllRooms') }} <ArrowUpRight :size="16" class="icon-flip"
        /></RouterLink>
      </div>
      <div class="mt-12 grid gap-6 sm:grid-cols-3">
        <RoomCard v-for="other in otherRooms.slice(0, 3)" :key="other.id" :room="other" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition:
    opacity 400ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.gallery-fade-enter-from {
  opacity: 0;
  transform: scale(1.02);
}
.gallery-fade-leave-to {
  opacity: 0;
  transform: scale(0.985);
}
</style>

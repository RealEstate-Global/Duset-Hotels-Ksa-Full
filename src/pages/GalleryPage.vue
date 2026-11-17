<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { galleryCategories } from '@/data/gallery'
import AppPageHeader from '@/components/common/AppPageHeader.vue'

const { t } = useI18n()
const activeCategory = ref(galleryCategories[0].id)
const lightboxIndex = ref<number | null>(null)

const activeImages = computed(
  () => galleryCategories.find((category) => category.id === activeCategory.value)?.images ?? [],
)
const activeCategoryLabel = computed(() => t(`gallery.categories.${activeCategory.value}`))
const gridClass = computed(() => {
  const n = activeImages.value.length
  const sm =
    n >= 10 ? 'sm:grid-cols-5' : n >= 8 ? 'sm:grid-cols-4' : n >= 5 ? 'sm:grid-cols-5' : n >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
  return `grid grid-cols-2 gap-3 sm:gap-4 ${sm}`
})
const isLastFullWidth = computed(() => activeImages.value.length % 2 === 1)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
}
const closeLightbox = () => {
  lightboxIndex.value = null
}
const stepLightbox = (direction: 1 | -1) => {
  if (lightboxIndex.value === null) return
  const total = activeImages.value.length
  lightboxIndex.value = (lightboxIndex.value + direction + total) % total
}
const onKeydown = (event: KeyboardEvent) => {
  if (lightboxIndex.value === null) return
  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowRight') stepLightbox(1)
  if (event.key === 'ArrowLeft') stepLightbox(-1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <AppPageHeader :eyebrow="t('gallery.eyebrow')" :title="t('gallery.title')" :description="t('gallery.subline')" />

    <section class="container-shell pt-10">
      <div class="flex flex-wrap gap-2 border-b border-border pb-5" role="tablist" :aria-label="t('gallery.ariaCategory')">
        <button
          v-for="category in galleryCategories"
          :key="category.id"
          role="tab"
          :aria-selected="activeCategory === category.id"
          class="rounded-full border px-4 py-2.5 text-xs font-bold transition duration-300"
          :class="
            activeCategory === category.id
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-border bg-card text-foreground/75 hover:border-accent/50 hover:text-foreground'
          "
          @click="activeCategory = category.id"
        >
          {{ t(`gallery.categories.${category.id}`) }}
          <span class="ml-1 opacity-60">{{ category.images.length }}</span>
        </button>
      </div>

      <div class="mt-8" :class="gridClass">
        <button
          v-for="(image, index) in activeImages"
          :key="image"
          class="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary"
          :class="isLastFullWidth && index === activeImages.length - 1 ? 'col-span-2 sm:col-span-1' : ''"
          :aria-label="t('gallery.openFullscreen', { index: index + 1 })"
          @click="openLightbox(index)"
        >
          <img
            :src="image"
            :alt="t('gallery.photoAlt', { category: activeCategoryLabel, index: index + 1 })"
            class="h-full w-full object-cover transition duration-700 ease-premium group-hover:scale-105"
            loading="lazy"
          />
          <span
            class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100"
            ><Expand :size="15"
          /></span>
        </button>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="lightboxIndex !== null"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="t('gallery.viewerLabel')"
        @click.self="closeLightbox"
      >
        <button
          class="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          :aria-label="t('gallery.close')"
          @click="closeLightbox"
        >
          <X :size="20" />
        </button>
        <button
          class="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-5"
          :aria-label="t('gallery.prev')"
          @click="stepLightbox(-1)"
        >
          <ChevronLeft :size="20" class="icon-flip" />
        </button>
        <img
          :src="activeImages[lightboxIndex]"
          :alt="t('gallery.photoAlt', { category: activeCategoryLabel, index: lightboxIndex + 1 })"
          class="max-h-[86vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
        />
        <button
          class="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-5"
          :aria-label="t('gallery.next')"
          @click="stepLightbox(1)"
        >
          <ChevronRight :size="20" class="icon-flip" />
        </button>
        <p class="absolute bottom-5 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
          {{ lightboxIndex + 1 }} / {{ activeImages.length }}
        </p>
      </div>
    </Teleport>
  </main>
</template>

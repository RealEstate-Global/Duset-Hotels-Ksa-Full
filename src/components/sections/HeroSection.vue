<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Sparkles, Star } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { SITE } from '@/constants/site'
import BookingWidget from '@/components/booking/BookingWidget.vue'

const { t, tm } = useI18n()

const slideImages = [
  '/images/uploads/538/3203_458duset_hotel_suites__43_.webp',
  '/images/uploads/538/3203_269duset_hotel_suites__44_.webp',
  '/images/uploads/538/3203_179duset_hotel_suites__45_.webp',
]

interface HeroSlide {
  eyebrow: string
  title: string
  alt: string
}

const slides = computed<HeroSlide[]>(() => tm('home.hero.slides') as unknown as HeroSlide[])

const current = ref(0)
let timer: number | undefined
const slide = computed(() => slides.value[current.value] ?? { eyebrow: '', title: '', alt: '' })

const goTo = (index: number) => {
  current.value = (index + slides.value.length) % slides.value.length
}
const restart = () => {
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => goTo(current.value + 1), 6000)
}
const next = () => {
  goTo(current.value + 1)
  restart()
}
const prev = () => {
  goTo(current.value - 1)
  restart()
}

onMounted(restart)
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <section
    class="relative overflow-hidden border-b border-border/70 pt-[68px] md:pt-[104px]"
    :aria-label="t('nav.links.home')"
  >
    <div class="relative min-h-[560px] sm:min-h-[620px] lg:min-h-[680px]">
      <Transition name="hero-fade">
        <img
          :key="slideImages[current]"
          :src="slideImages[current]"
          :alt="slide.alt"
          class="absolute inset-0 h-full w-full object-cover"
          fetchpriority="high"
        />
      </Transition>
      <div
        class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/5 rtl:bg-gradient-to-l"
        aria-hidden="true"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25"
        aria-hidden="true"
      />

      <div class="container-shell relative flex min-h-[560px] flex-col justify-center py-12 sm:min-h-[620px] lg:min-h-[680px]">
        <div class="max-w-2xl">
          <Transition name="hero-text" mode="out-in">
            <div :key="current">
              <p
                class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur"
              >
                <Sparkles :size="13" class="text-on-dark-accent" /> {{ slide.eyebrow }}
              </p>
              <h1
                class="display-title mt-6 text-display-lg text-white"
                v-html="slide.title"
              />
            </div>
          </Transition>
          <p class="mt-6 max-w-md text-body-lg text-white/80">
            {{ t('home.hero.subline') }}
          </p>
          <div class="mt-9 flex flex-wrap items-center gap-4">
            <RouterLink
              to="/booking"
              class="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-sm font-bold text-accent-foreground transition duration-300 ease-premium hover:-translate-y-1 hover:shadow-float"
            >
              {{ t('common.actions.bookNow') }}
              <ArrowRight
                :size="16"
                class="icon-flip transition-transform duration-300 group-hover:translate-x-1"
              />
            </RouterLink>
            <RouterLink
              to="/rooms"
              class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              {{ t('common.actions.exploreRooms') }}
            </RouterLink>
          </div>
          <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-white/80">
            <div class="flex items-center gap-2 text-sm">
              <Star :size="16" class="fill-current text-on-dark-accent" />
              <span class="font-semibold text-white/90">{{ t('home.hero.ratingLabel', { rating: SITE.tripadvisorRating, reviews: SITE.tripadvisorReviews }) }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <MapPin :size="16" class="text-on-dark-accent" />
              <span>{{ t('home.hero.locationLabel') }}</span>
            </div>
          </div>
        </div>

        <div class="absolute bottom-8 right-5 flex items-center gap-3 sm:right-8 lg:right-12">
          <button
            class="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            :aria-label="t('home.hero.prevSlide')"
            @click="prev"
          >
            <ChevronLeft :size="18" class="icon-flip" />
          </button>
          <div class="flex gap-2" role="tablist" :aria-label="t('home.hero.chooseSlide')">
            <button
              v-for="(_, index) in slides"
              :key="index"
              role="tab"
              :aria-selected="index === current"
              :aria-label="`${index + 1} / ${slides.length}`"
              class="h-1.5 rounded-full transition-all duration-400"
              :class="index === current ? 'w-8 bg-accent' : 'w-3 bg-white/40'"
              @click="goTo(index); restart()"
            />
          </div>
          <button
            class="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            :aria-label="t('home.hero.nextSlide')"
            @click="next"
          >
            <ChevronRight :size="18" class="icon-flip" />
          </button>
        </div>
      </div>
    </div>

    <div class="relative z-30 border-t border-white/10 bg-[#0e1a16] py-4 sm:py-6">
      <div class="container-shell">
        <BookingWidget />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

.hero-text-enter-active {
  transition:
    opacity 500ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-text-leave-active {
  transition: opacity 250ms ease;
}
.hero-text-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.hero-text-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .hero-fade-enter-active,
  .hero-fade-leave-active,
  .hero-text-enter-active,
  .hero-text-leave-active {
    transition: none;
  }
}
</style>

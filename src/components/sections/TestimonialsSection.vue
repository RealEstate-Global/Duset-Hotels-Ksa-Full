<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowLeft, ArrowRight, Star } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { SITE } from '@/constants/site'

const { t, tm } = useI18n()

const testimonials = computed(
  () => tm('home.testimonials.items') as unknown as { quote: string; name: string }[],
)
const current = ref(0)
let timer: number | undefined
const testimonial = computed(
  () => testimonials.value[current.value] ?? { quote: '', name: '' },
)
const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
const goTo = (index: number) => {
  current.value = (index + testimonials.value.length) % testimonials.value.length
}

onMounted(() => {
  timer = window.setInterval(() => goTo(current.value + 1), 6500)
})
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <section class="container-shell py-20 sm:py-28">
    <div class="grid items-end gap-10 lg:grid-cols-[0.65fr_1.35fr]">
      <SectionHeading
        :eyebrow="t('home.testimonials.eyebrow')"
        :title="t('home.testimonials.title')"
      />
      <div class="flex items-center gap-6 lg:justify-end">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Star :size="16" class="fill-accent text-accent" />
          <span>{{ t('home.testimonials.reviewsLabel', { rating: SITE.tripadvisorRating, reviews: SITE.tripadvisorReviews }) }}</span>
        </div>
        <div class="flex gap-2">
          <button
            class="flex h-11 w-11 items-center justify-center rounded-full border border-border transition hover:bg-secondary"
            :aria-label="t('home.testimonials.prev')"
            @click="goTo(current - 1)"
          >
            <ArrowLeft :size="17" class="icon-flip" /></button
          ><button
            class="flex h-11 w-11 items-center justify-center rounded-full border border-border transition hover:bg-secondary"
            :aria-label="t('home.testimonials.next')"
            @click="goTo(current + 1)"
          >
            <ArrowRight :size="17" class="icon-flip" />
          </button>
        </div>
      </div>
    </div>
    <div class="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div
        class="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-primary p-10 text-center text-primary-foreground sm:min-h-[380px]"
      >
        <span
          class="flex h-24 w-24 items-center justify-center rounded-full bg-accent font-display text-3xl font-semibold text-accent-foreground"
        >
          {{ initials(testimonial.name) }}
        </span>
        <p class="mt-6 font-display text-xl font-semibold tracking-[-0.03em]">
          {{ testimonial.name }}
        </p>
        <div class="mt-2 flex gap-0.5 text-inverse-accent">
          <Star v-for="star in 5" :key="star" :size="16" :fill="'currentColor'" />
        </div>
        <p class="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/55">
          {{ t('home.testimonials.verifiedRole') }}
        </p>
      </div>
      <div class="flex flex-col justify-center rounded-2xl bg-secondary/55 p-8 sm:p-12 lg:p-16">
        <span class="font-display text-6xl leading-none text-accent/40">“</span>
        <blockquote
          :key="current"
          class="testimonial-quote mt-3 max-w-2xl font-display text-2xl font-semibold leading-[1.25] tracking-[-0.03em] sm:text-3xl"
        >
          {{ testimonial.quote }}
        </blockquote>
        <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6">
          <a
            :href="SITE.social.tripadvisor"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground"
            >{{ t('common.actions.readMoreOnTripadvisor') }}</a
          >
          <div class="flex gap-1 sm:gap-2">
            <button
              v-for="(_, index) in testimonials"
              :key="index"
              class="h-1 rounded-full transition-all duration-300"
              :class="index === current ? 'w-8 bg-accent' : 'w-3 bg-border'"
              :aria-label="`${index + 1} / ${testimonials.length}`"
              @click="goTo(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonial-quote {
  animation: quote-in 450ms cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes quote-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .testimonial-quote {
    animation: none;
  }
}
</style>

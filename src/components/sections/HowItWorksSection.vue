<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, BedDouble, CalendarCheck2, KeyRound, Sparkles } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'


const { t, tm } = useI18n()

const icons = [BedDouble, CalendarCheck2, KeyRound]

interface Step {
  title: string
  copy: string
}

const steps = computed(() =>
  (tm('home.howItWorks.steps') as unknown as Step[]).map((step, index) => ({
    ...step,
    number: `0${index + 1}`,
    icon: icons[index],
  })),
)
</script>

<template>
  <section id="approach" class="bg-primary py-20 text-primary-foreground sm:py-28">
    <div class="container-shell">
      <div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <p class="eyebrow-inverse">{{ t('home.howItWorks.eyebrow') }}</p>
          <h2 class="display-title mt-4 max-w-2xl text-h2" v-html="t('home.howItWorks.title')" />
        </div>
        <p class="max-w-sm text-body-md text-primary-foreground/60">
          {{ t('home.howItWorks.subline') }}
        </p>
      </div>
      <div class="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        <div
          class="absolute left-[12%] right-[12%] top-8 hidden h-px bg-primary-foreground/15 md:block"
        />
        <div v-for="step in steps" :key="step.number" class="relative">
          <div class="flex items-center gap-4">
            <div
              class="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-float"
            >
              <component :is="step.icon" :size="22" :stroke-width="1.7" />
            </div>
            <span
              class="font-display text-5xl font-semibold tracking-[-0.07em] text-primary-foreground/15"
              >{{ step.number }}</span
            >
          </div>
          <h3 class="mt-7 font-display text-2xl font-semibold tracking-[-0.04em]">
            {{ step.title }}
          </h3>
          <p class="mt-3 max-w-xs text-sm leading-7 text-primary-foreground/55">{{ step.copy }}</p>
        </div>
      </div>
      <div class="mt-16 flex flex-wrap items-center justify-between gap-6">
        <div class="flex items-center gap-3 text-sm font-bold text-inverse-accent">
          <Sparkles :size="16" /> {{ t('home.howItWorks.badge') }} <ArrowRight :size="16" class="icon-flip" />
        </div>
        <RouterLink
          to="/booking"
          class="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
        >
          {{ t('common.actions.bookNow') }} <ArrowRight :size="15" class="icon-flip" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

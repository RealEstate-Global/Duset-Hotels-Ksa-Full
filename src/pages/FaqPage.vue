<script setup lang="ts">
import FaqSection from '@/components/sections/FaqSection.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { tm } = useI18n()
const faqCount = computed(() => (tm('faq.items') as unknown as unknown[]).length)
</script>

<template>
  <main class="pb-0 pt-[68px] md:pt-[104px]">
    <section class="border-b border-border/70 bg-secondary/40 py-16 sm:py-20">
      <div class="container-shell">
        <p class="eyebrow">{{ $t('faq.eyebrow') }}</p>
        <h1 class="display-title mt-4 text-h1" v-html="$t('faq.title')" />
      </div>
    </section>

    <FaqSection :limit="faqCount" />
  </main>
</template>

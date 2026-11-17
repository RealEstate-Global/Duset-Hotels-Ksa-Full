<script setup lang="ts">
import FaqSection from '@/components/sections/FaqSection.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import AppPageHeader from '@/components/common/AppPageHeader.vue'

const { tm } = useI18n()
const faqCount = computed(() => (tm('faq.items') as unknown as unknown[]).length)
</script>

<template>
  <main class="pb-0 pt-[68px] md:pt-[104px]">
    <AppPageHeader :eyebrow="$t('faq.eyebrow')" :title="$t('faq.title')" :description="$t('faq.subline')" />

    <FaqSection :limit="faqCount" />
  </main>
</template>

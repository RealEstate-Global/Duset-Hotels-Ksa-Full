<script setup lang="ts">
import AttractionsGrid from '@/components/sections/AttractionsGrid.vue'
import { useI18n } from 'vue-i18n'
import { SITE } from '@/constants/site'
import AppPageHeader from '@/components/common/AppPageHeader.vue'

const { t } = useI18n()
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <AppPageHeader :eyebrow="t('attractions.eyebrow')" :title="t('attractions.title')" :description="t('attractions.subline')" />

    <section class="container-shell pt-14">
      <AttractionsGrid :limit="9" />
      <p class="mt-10 text-center text-sm text-muted-foreground">
        {{ t('attractions.tapToOpen') }}
        <a :href="SITE.mapsUrl" target="_blank" rel="noopener noreferrer" class="link-underline font-bold text-foreground">{{ t('attractions.getDirections') }}</a>
      </p>
    </section>
  </main>
</template>

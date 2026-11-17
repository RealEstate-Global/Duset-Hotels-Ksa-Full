<script setup lang="ts">
import AttractionsGrid from '@/components/sections/AttractionsGrid.vue'
import { useI18n } from 'vue-i18n'
import { SITE } from '@/constants/site'

const { t } = useI18n()
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <section class="border-b border-border/70 bg-secondary/40 py-16 sm:py-20">
      <div class="container-shell flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <p class="eyebrow">{{ t('attractions.eyebrow') }}</p>
          <h1 class="display-title mt-4 text-h1" v-html="t('attractions.title')" />
        </div>
        <p class="max-w-sm text-body-md text-muted-foreground">
          {{ t('attractions.subline') }}
        </p>
      </div>
    </section>

    <section class="container-shell pt-14">
      <AttractionsGrid :limit="9" />
      <p class="mt-10 text-center text-sm text-muted-foreground">
        {{ t('attractions.tapToOpen') }}
        <a :href="SITE.mapsUrl" target="_blank" rel="noopener noreferrer" class="link-underline font-bold text-foreground">{{ t('attractions.getDirections') }}</a>
      </p>
    </section>
  </main>
</template>

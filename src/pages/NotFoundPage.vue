<script setup lang="ts">
import { ArrowLeft, Building2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-background px-6 pt-[68px] text-center md:pt-[104px]">
    <div>
      <p class="eyebrow">{{ t('ui.notFound.eyebrow') }}</p>
      <h1 class="display-title mt-4 text-h1" v-html="t('ui.notFound.title')" />
      <p class="mx-auto mt-5 max-w-md text-body-md text-muted-foreground">
        {{ t('ui.notFound.copy') }}
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5"
        >
          <ArrowLeft :size="15" class="icon-flip" /> {{ t('ui.notFound.backHome') }}
        </RouterLink>
        <RouterLink
          to="/booking"
          class="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5"
        >
          <Building2 :size="15" /> {{ t('common.actions.bookNow') }}
        </RouterLink>
      </div>
    </div>
  </main>
</template>

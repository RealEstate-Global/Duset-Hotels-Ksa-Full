<script setup lang="ts">
import { computed, onErrorCaptured, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ToastHost from '@/components/common/ToastHost.vue'
import { useI18n } from 'vue-i18n'

const hasError = ref(false)
const reloadPage = () => window.location.reload()
const { t, locale } = useI18n()
const route = useRoute()

const isDashboard = computed(() => route.meta.layout === 'dashboard')

// Keep the tab title/description in sync when the language is toggled without a navigation.
watch(locale, () => {
  const key = String(route.meta.metaKey ?? 'home')
  document.title = t(`ui.meta.${key}.title`)
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', t(`ui.meta.${key}.description`))
})

onErrorCaptured((err) => {
  console.error('[app] captured error:', err)
  hasError.value = true
  return false
})
</script>

<template>
  <component :is="isDashboard ? DashboardLayout : DefaultLayout" v-if="!hasError">
    <RouterView />
  </component>
  <main v-else class="flex min-h-screen items-center justify-center bg-background px-6 text-center">
    <div>
      <p class="eyebrow">{{ t('ui.error.eyebrow') }}</p>
      <h1 class="display-title mt-4 text-h1" v-html="t('ui.error.title')" />
      <p class="mt-5 text-sm text-muted-foreground">
        {{ t('ui.error.copy') }}
      </p>
      <button
        class="mt-8 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground"
        @click="reloadPage"
      >
        {{ t('ui.error.refresh') }}
      </button>
    </div>
  </main>
  <ToastHost />
</template>

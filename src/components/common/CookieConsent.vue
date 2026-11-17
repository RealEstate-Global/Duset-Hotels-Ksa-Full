<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Cookie, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const CONSENT_KEY = 'duset-cookie-consent'
const CONSENT_COOKIE = 'duset_cookie_consent'
const CONSENT_SESSION = 'duset-cookie-consent-session'
const SHOW_DELAY_MS = 3000

const visible = ref(false)
let timer: number | undefined

const getStoredConsent = (): string | null => {
  try {
    const fromLocal = window.localStorage.getItem(CONSENT_KEY)
    if (fromLocal) return fromLocal
    const fromSession = window.sessionStorage.getItem(CONSENT_SESSION)
    if (fromSession) return fromSession
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
    if (cookie) return decodeURIComponent(cookie.split('=')[1] ?? '')
  } catch {
    /* storage blocked — treat as no consent yet */
  }
  return null
}

const storeConsent = (status: 'accepted' | 'declined') => {
  const payload = JSON.stringify({ status, at: new Date().toISOString() })
  try {
    window.localStorage.setItem(CONSENT_KEY, payload)
    window.sessionStorage.setItem(CONSENT_SESSION, payload)
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
      payload,
    )}; max-age=31536000; path=/; SameSite=Lax`
  } catch {
    /* storage blocked — banner just won't persist */
  }
  visible.value = false
}

const accept = () => storeConsent('accepted')
const decline = () => storeConsent('declined')

onMounted(() => {
  if (getStoredConsent()) return
  timer = window.setTimeout(() => {
    visible.value = true
  }, SHOW_DELAY_MS)
})

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
})
</script>

<template>
  <Transition name="cookie-banner">
    <section
      v-if="visible"
      class="fixed inset-x-0 bottom-24 z-40 mx-auto w-[min(92vw,540px)] md:bottom-6"
      role="dialog"
      aria-modal="false"
      :aria-label="t('ui.cookie.ariaLabel')"
    >
      <div
        class="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-5 shadow-card-hover backdrop-blur-xl"
      >
        <div class="flex items-start gap-4">
          <span
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent"
          >
            <Cookie :size="24" :stroke-width="1.7" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-display text-base font-semibold tracking-[-0.02em]">
              {{ t('ui.cookie.title') }}
            </p>
            <p class="mt-1 text-sm leading-6 text-muted-foreground">{{ t('ui.cookie.body') }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <button
                class="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
                @click="accept"
              >
                {{ t('ui.cookie.accept') }}
              </button>
              <button
                class="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-foreground/80 transition duration-300 hover:border-foreground/30 hover:text-foreground"
                @click="decline"
              >
                {{ t('ui.cookie.decline') }}
              </button>
              <RouterLink
                to="/privacy-policy"
                class="link-underline text-[11px] font-bold text-muted-foreground transition hover:text-foreground"
              >
                {{ t('ui.cookie.privacy') }}
              </RouterLink>
            </div>
          </div>
          <button
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            :aria-label="t('common.actions.close')"
            @click="decline"
          >
            <X :size="16" />
          </button>
        </div>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.cookie-banner-enter-active,
.cookie-banner-leave-active {
  transition:
    opacity 380ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
}
.cookie-banner-enter-from {
  opacity: 0;
  transform: translateY(32px) scale(0.96);
}
.cookie-banner-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}
.cookie-banner-enter-to,
.cookie-banner-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
@media (prefers-reduced-motion: reduce) {
  .cookie-banner-enter-active,
  .cookie-banner-leave-active {
    transition: none;
  }
}
</style>

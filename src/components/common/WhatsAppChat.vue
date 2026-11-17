<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Send, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { SITE } from '@/constants/site'

const { t, tm } = useI18n()
const open = ref(false)
const message = ref('')

const WHATSAPP_SVG =
  'M17.472 14.382c-0.297-0.149-1.758-0.867-2.03-0.967c-0.273-0.099-0.471-0.148-0.67 0.15c-0.197 0.297-0.767 0.966-0.94 1.164c-0.173 0.199-0.347 0.223-0.644 0.075c-0.297-0.15-1.255-0.463-2.39-1.475c-0.883-0.79-1.48-1.761-1.653-2.059c-0.173-0.297-0.018-0.458 0.13-0.606c0.134-0.133 0.297-0.347 0.446-0.52c0.149-0.174 0.198-0.298 0.297-0.497c0.1-0.198 0.05-0.371-0.025-0.52c-0.075-0.149-0.669-1.612-0.916-2.207c-0.242-0.579-0.487-0.5-0.669-0.51c-0.173-0.008-0.371-0.01-0.57-0.01c-0.198 0-0.52 0.074-0.792 0.372c-0.272 0.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074c0.149 0.198 2.096 3.2 5.077 4.487c0.709 0.306 1.262 0.49 1.694 0.627c0.712 0.226 1.36 0.194 1.871 0.118c0.571-0.085 1.758-0.718 2.006-1.41c0.247-0.69 0.247-1.281 0.173-1.405c-0.074-0.124-0.272-0.198-0.57-0.347m-5.421 4.403h-.004a9.005 9.005 0 01-4.54-1.22l-.324-.19l-3.285.849l.853-3.079l-.208-.323a7.5 7.5 0 01-1.216-4.02a7.507 7.507 0 017.497-7.5c2.004.001 3.89.784 5.31 2.201a7.491 7.491 0 012.195 5.303c-.003 4.14-3.367 7.514-7.508 7.514m6.398-18.412A9.42 9.42 0 0012.05.25C5.5.251.122 4.626.12 11.17a11.12 11.12 0 001.494 5.6L.056 24l7.39-1.93a11.1 11.1 0 005.604 1.42h.005c6.548 0 11.925-4.375 11.928-10.92a11.17 11.17 0 00-3.3-7.74'

const waLink = (text: string) =>
  `${SITE.whatsappUrl}?text=${encodeURIComponent(text)}`

const greeting = computed(() => t('ui.chat.greeting'))

const chipsList = computed<string[]>(() => {
  const raw = tm('ui.chat.chips')
  return Array.isArray(raw) ? (raw as string[]) : []
})

const sendText = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return
  window.open(waLink(trimmed), '_blank', 'noopener,noreferrer')
  message.value = ''
}

const sendChip = (chip: string) => sendText(chip)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') open.value = false
}

watch(open, (isOpen) => {
  if (isOpen) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-6">
    <Transition name="chat-card">
      <div
        v-if="open"
        class="w-[min(92vw,340px)] overflow-hidden rounded-2xl border border-black/10 shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="t('ui.chat.openChat')"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-1.5"
          >
            <img
              src="/images/uploads/logos/3203_duset_hotel_suites_logo.webp"
              alt="Duset Hotel Suites"
              class="h-full w-full object-contain"
            />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate font-display text-[15px] font-bold leading-tight">
              {{ t('ui.chat.title') }}
            </p>
            <p class="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-200">
              <span class="relative flex h-2 w-2">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70"
                />
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {{ t('ui.chat.onlineNow') }} · {{ t('ui.chat.subtitle') }}
            </p>
          </div>
          <button
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            :aria-label="t('ui.chat.closeChat')"
            @click="open = false"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Body -->
        <div class="chat-body space-y-2 px-3 py-4">
          <div class="flex">
            <div
              class="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-[13px] leading-5 text-slate-800 shadow-sm dark:bg-[#1f2c34] dark:text-slate-100"
            >
              {{ greeting }}
              <span class="mt-1 block text-right text-[10px] text-slate-400 dark:text-slate-500">now</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-1">
            <button
              v-for="chip in chipsList"
              :key="chip"
              class="rounded-full border border-[#075e54]/30 bg-white/70 px-3 py-2 text-[11px] font-semibold text-[#075e54] shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-emerald-400/20 dark:bg-[#1f2c34]/70 dark:text-emerald-300"
              @click="sendChip(chip)"
            >
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Composer -->
        <form class="flex items-center gap-2 bg-[#f0f2f5] p-2 dark:bg-[#111b21]" @submit.prevent="sendText(message)">
          <label class="sr-only" for="wa-message">{{ t('ui.chat.composePlaceholder') }}</label>
          <input
            id="wa-message"
            v-model="message"
            type="text"
            :placeholder="t('ui.chat.composePlaceholder')"
            autocomplete="off"
            class="h-11 min-w-0 flex-1 rounded-full border-0 bg-white px-4 text-sm text-slate-800 outline-none ring-emerald-600/40 transition placeholder:text-slate-400 focus:ring-2 dark:bg-[#2a3942] dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#075e54] shadow-md transition duration-300 hover:scale-105 hover:shadow-lg"
            :aria-label="t('common.actions.send')"
          >
            <Send :size="18" :stroke-width="2" class="-translate-x-px translate-y-px" />
          </button>
        </form>
      </div>
    </Transition>

    <!-- Floating button -->
    <button
      class="group relative flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      :aria-expanded="open"
      :aria-label="open ? t('ui.chat.closeChat') : t('ui.chat.openChat')"
      @click="open = !open"
    >
      <span class="pointer-events-none absolute inset-0 animate-[wa-ping_2.6s_ease-out_infinite] rounded-full border-2 border-[#25D366]/60" />
      <svg viewBox="0 0 24 24" fill="currentColor" class="h-8 w-8 transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
        <path :d="WHATSAPP_SVG" />
      </svg>
      <span
        v-if="!open"
        class="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-[#25D366] text-[9px] font-black text-[#075e54]"
      >
        1
      </span>
    </button>
  </div>
</template>

<style scoped>
.chat-body {
  background-color: #ece5dc;
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.08) 1px, transparent 0);
  background-size: 18px 18px;
}
:global(.dark) .chat-body {
  background-color: #0b141a;
  background-image: radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.05) 1px, transparent 0);
  background-size: 18px 18px;
}

.chat-card-enter-active,
.chat-card-leave-active {
  transition:
    opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.chat-card-enter-from,
.chat-card-leave-to {
  opacity: 0;
  transform: translateY(22px) scale(0.92);
}

@keyframes wa-ping {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  75%,
  100% {
    transform: scale(1.65);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-card-enter-active,
  .chat-card-leave-active {
    transition: none;
  }
  .chat-body {
    background-image: none;
  }
  button span {
    animation: none !important;
  }
}
</style>

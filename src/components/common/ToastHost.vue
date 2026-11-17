<script setup lang="ts">
import { CheckCircle2, Info, XCircle, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const { toasts, dismiss } = useToast()

const icons = {
  success: CheckCircle2,
  info: Info,
  error: XCircle,
} as const

const iconClass = {
  success: 'text-emerald-400',
  info: 'text-sky-400',
  error: 'text-rose-400',
} as const
</script>

<template>
  <Teleport to="body">
    <div
      aria-live="polite"
      class="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(92vw,360px)] flex-col gap-2 sm:right-6 sm:top-6"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-card-hover backdrop-blur-xl"
          role="status"
        >
          <component :is="icons[toast.kind]" :size="18" class="mt-0.5 shrink-0" :class="iconClass[toast.kind]" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold leading-5">{{ toast.title }}</p>
            <p v-if="toast.message" class="mt-0.5 text-xs leading-5 text-muted-foreground">
              {{ toast.message }}
            </p>
          </div>
          <button
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            :aria-label="t('common.actions.close')"
            @click="dismiss(toast.id)"
          >
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-14px) scale(0.96);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(32px) scale(0.96);
}
.toast-move {
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: none;
  }
}
</style>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { AlertTriangle, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    body: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
  }>(),
  { danger: true },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
const { t } = useI18n()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) emit('cancel')
}

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body"
    ><Transition name="confirm-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[65] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('cancel')" />
        <div
          class="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-card-hover"
        >
          <button
            class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            :aria-label="t('common.actions.close')"
            @click="emit('cancel')"
          >
            <X :size="17" />
          </button>
          <span
            class="flex h-12 w-12 items-center justify-center rounded-xl"
            :class="danger ? 'bg-rose-500/15 text-rose-500' : 'bg-accent/10 text-accent'"
          >
            <AlertTriangle :size="22" :stroke-width="1.8" />
          </span>
          <h2 class="mt-4 font-display text-xl font-semibold tracking-[-0.03em]">{{ title }}</h2>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ body }}</p>
          <div class="mt-6 flex flex-wrap justify-end gap-2">
            <button
              class="rounded-full border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-foreground/80 transition hover:border-foreground/30 hover:text-foreground"
              @click="emit('cancel')"
            >
              {{ cancelLabel ?? t('common.actions.back') }}
            </button>
            <button
              class="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5"
              :class="danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-accent hover:bg-accent/90 text-accent-foreground'"
              @click="emit('confirm')"
            >
              {{ confirmLabel ?? t('common.actions.send') }}
            </button>
          </div>
        </div>
      </div>
    </Transition></Teleport
  >
</template>

<style scoped>
.confirm-modal-enter-active,
.confirm-modal-leave-active {
  transition:
    opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.confirm-modal-enter-from,
.confirm-modal-leave-to {
  opacity: 0;
  transform: scale(0.94) translateY(12px);
}
@media (prefers-reduced-motion: reduce) {
  .confirm-modal-enter-active,
  .confirm-modal-leave-active {
    transition: none;
  }
}
</style>

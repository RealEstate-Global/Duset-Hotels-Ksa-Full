<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarDays, ChevronDown } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import AppCalendar from '@/components/common/AppCalendar.vue'
import { usePopover } from '@/composables/usePopover'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    min?: string
    id?: string
    ariaLabel?: string
    variant?: 'default' | 'dark'
    hideIcon?: boolean
  }>(),
  {
    variant: 'default',
    hideIcon: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { locale } = useI18n()
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const { panelStyle } = usePopover(root, isOpen, panel, {
  offset: 8,
  flipThreshold: 280,
  estimatedHeight: 330,
})

const dateLocale = computed(() => (locale.value === 'ar' ? 'ar-SA' : 'en-SA'))

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder ?? ''
  const date = new Date(`${props.modelValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return props.modelValue
  return new Intl.DateTimeFormat(dateLocale.value, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
})

const close = () => {
  isOpen.value = false
}

const handleSelect = (iso: string) => {
  emit('update:modelValue', iso)
  close()
}

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div ref="root" class="relative w-full">
    <label v-if="label" :for="id" class="text-caption font-bold uppercase text-muted-foreground">
      {{ label }}
    </label>
    <button
      :id="id"
      type="button"
      class="app-datepicker-trigger"
      :class="{ 'app-datepicker-trigger-dark': variant === 'dark' }"
      :aria-expanded="isOpen"
      :aria-label="ariaLabel"
      aria-haspopup="dialog"
      @click="toggle"
    >
      <span
        v-if="!hideIcon"
        class="app-datepicker-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/70 text-foreground/80"
      >
        <CalendarDays :size="17" />
      </span>
      <span class="app-datepicker-value min-w-0 flex-1 truncate text-left text-sm font-bold text-foreground rtl:text-right">
        {{ displayValue }}
      </span>
      <ChevronDown
        :size="15"
        :stroke-width="2.2"
        class="shrink-0 opacity-60 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      />
    </button>

    <Teleport to="body">
      <Transition name="app-datepicker-panel">
        <div
          v-if="isOpen"
          ref="panel"
          role="dialog"
          aria-modal="false"
          class="w-[min(92vw,320px)] rounded-2xl border border-border/80 bg-card p-4 shadow-card-hover backdrop-blur-xl"
          :style="panelStyle"
        >
          <AppCalendar
            :model-value="modelValue"
            :min="min"
            @update:model-value="handleSelect"
            @select="handleSelect"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.app-datepicker-trigger {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  min-height: 48px;
  border-radius: 0.85rem;
  border: 1px solid transparent;
  background: hsl(var(--secondary) / 0.55);
  padding: 0.35rem 0.6rem;
  outline: none;
  transition:
    border-color 200ms,
    background 200ms,
    box-shadow 200ms;
}
.app-datepicker-trigger:hover,
.app-datepicker-trigger:focus-visible,
.app-datepicker-trigger[aria-expanded='true'] {
  border-color: hsl(var(--accent) / 0.55);
  background: hsl(var(--secondary) / 0.85);
  box-shadow: 0 0 0 3px hsl(var(--accent) / 0.12);
}

.app-datepicker-trigger-dark {
  border-color: transparent;
  background: rgb(255 255 255 / 0.07);
  color: #fff;
  color-scheme: dark;
}
.app-datepicker-trigger-dark:hover,
.app-datepicker-trigger-dark:focus-visible,
.app-datepicker-trigger-dark[aria-expanded='true'] {
  border-color: rgb(255 255 255 / 0.18);
  background: rgb(255 255 255 / 0.12);
  box-shadow: 0 0 0 3px hsl(var(--accent) / 0.25);
}
.app-datepicker-trigger-dark .app-datepicker-icon {
  background: rgb(255 255 255 / 0.1);
}
.app-datepicker-trigger-dark .app-datepicker-value {
  color: #fff;
}

.app-datepicker-panel-enter-active,
.app-datepicker-panel-leave-active {
  transition:
    opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.app-datepicker-panel-enter-from,
.app-datepicker-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .app-datepicker-panel-enter-active,
  .app-datepicker-panel-leave-active {
    transition: none;
  }
}
</style>

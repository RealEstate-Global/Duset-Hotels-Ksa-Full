<script setup lang="ts">
import { computed, useId, ref, watch } from 'vue'
import { Check, ChevronDown } from 'lucide-vue-next'
import { openSelectId } from './appSelectState'
import { usePopover } from '@/composables/usePopover'

export interface SelectOption {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    options: SelectOption[]
    label?: string
    placeholder?: string
    ariaLabel?: string
    variant?: 'default' | 'dark'
    size?: 'sm' | 'md'
    disabled?: boolean
    id?: string
    maxHeightClass?: string
  }>(),
  {
    variant: 'default',
    size: 'md',
    disabled: false,
    maxHeightClass: 'max-h-64',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const listboxId = useId()
const isOpen = ref(false)
const activeIndex = ref(-1)

const { panelStyle, triggerElFocus } = usePopover(root, isOpen, panel, {
  offset: 8,
  flipThreshold: 230,
  estimatedHeight: 240,
  matchTriggerWidth: true,
})

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue) ?? null,
)

const activeOptionId = computed(() =>
  activeIndex.value >= 0 ? `${listboxId}-option-${activeIndex.value}` : undefined,
)

const close = () => {
  isOpen.value = false
  if (openSelectId.value === listboxId) openSelectId.value = null
  activeIndex.value = -1
}

const open = () => {
  if (props.disabled) return
  isOpen.value = true
  openSelectId.value = listboxId
  activeIndex.value = Math.max(
    0,
    props.options.findIndex((option) => option.value === props.modelValue),
  )
}

const toggle = () => (isOpen.value ? close() : open())

const choose = (index: number) => {
  const option = props.options[index]
  if (!option) return
  emit('update:modelValue', option.value)
  close()
  triggerElFocus()
}

const move = (delta: number) => {
  if (!isOpen.value) return open()
  const count = props.options.length
  activeIndex.value = (activeIndex.value + delta + count) % count
}

const moveTo = (index: number) => {
  activeIndex.value = index
}

const handleTypeahead = (char: string) => {
  const lower = char.toLowerCase()
  const current = activeIndex.value
  for (let offset = 1; offset <= props.options.length; offset++) {
    const index = (current + offset) % props.options.length
    if (props.options[index]?.label.toLowerCase().startsWith(lower)) {
      if (!isOpen.value) open()
      activeIndex.value = index
      return
    }
  }
}

const onKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (isOpen.value) {
        if (activeIndex.value >= 0) choose(activeIndex.value)
        else close()
      } else {
        open()
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Home':
      event.preventDefault()
      if (!isOpen.value) open()
      else moveTo(0)
      break
    case 'End':
      event.preventDefault()
      if (!isOpen.value) open()
      else moveTo(props.options.length - 1)
      break
    case 'Escape':
      if (isOpen.value) {
        event.preventDefault()
        close()
      }
      break
    case 'Tab':
      close()
      break
    default:
      if (
        event.key.length === 1 &&
        /\S/.test(event.key) &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        handleTypeahead(event.key)
      }
  }
}

watch(openSelectId, (id) => {
  if (id !== listboxId && isOpen.value) close()
})
</script>

<template>
  <div ref="root" class="relative" :class="{ 'w-full': !label }">
    <label v-if="label" :for="id ?? listboxId" class="text-caption font-bold uppercase text-muted-foreground">
      {{ label }}
    </label>
    <button
      :id="id ?? listboxId"
      type="button"
      role="combobox"
      :aria-label="ariaLabel ?? label"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="`${listboxId}-listbox`"
      :aria-activedescendant="activeOptionId"
      :aria-disabled="disabled"
      :disabled="disabled"
      class="app-select-trigger"
      :class="[
        variant === 'dark' ? 'app-select-trigger-dark' : 'app-select-trigger-default',
        size === 'sm' ? 'app-select-trigger-sm' : 'app-select-trigger-md',
        { 'app-select-trigger-open': isOpen, 'app-select-trigger-disabled': disabled },
      ]"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="min-w-0 flex-1 truncate text-left rtl:text-right">
        {{ selectedOption?.label ?? placeholder ?? '' }}
      </span>
      <ChevronDown
        :size="16"
        :stroke-width="2"
        class="shrink-0 opacity-70 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      />
    </button>

    <Teleport to="body">
      <Transition name="app-select-panel">
        <ul
          v-if="isOpen"
          :id="`${listboxId}-listbox`"
          ref="panel"
          role="listbox"
          tabindex="-1"
          class="app-select-panel"
          :class="[variant === 'dark' ? 'app-select-panel-dark' : 'app-select-panel-default', maxHeightClass]"
          :style="panelStyle"
          :aria-label="ariaLabel ?? label"
        >
          <li
            v-for="(option, index) in options"
            :id="`${listboxId}-option-${index}`"
            :key="option.value"
            role="option"
            :aria-selected="option.value === modelValue"
            class="app-select-option"
            :class="[
              variant === 'dark' ? 'app-select-option-dark' : 'app-select-option-default',
              { 'app-select-option-active': index === activeIndex, 'app-select-option-selected': option.value === modelValue },
            ]"
            @pointerenter="moveTo(index)"
            @click="choose(index)"
          >
            <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
            <Check
              v-if="option.value === modelValue"
              :size="15"
              :stroke-width="2.6"
              class="shrink-0"
              aria-hidden="true"
            />
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.app-select-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  border-radius: 0.85rem;
  outline: none;
  cursor: pointer;
  transition:
    border-color 200ms,
    background 200ms,
    box-shadow 200ms;
}
.app-select-trigger-md {
  min-height: 48px;
  padding: 0.6rem 0.9rem;
  font-size: 0.875rem;
}
.app-select-trigger-sm {
  min-height: 40px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8125rem;
}
.app-select-trigger-default {
  border: 1px solid hsl(var(--border) / 0.8);
  background: hsl(var(--background) / 0.6);
  font-weight: 600;
  color: hsl(var(--foreground));
}
.app-select-trigger-default:hover {
  border-color: hsl(var(--accent) / 0.4);
}
.app-select-trigger-default:focus-visible,
.app-select-trigger-open {
  border-color: hsl(var(--accent) / 0.6);
  background: hsl(var(--background));
  box-shadow: 0 0 0 3px hsl(var(--accent) / 0.12);
}
.app-select-trigger-dark {
  border: 1px solid rgb(255 255 255 / 0.14);
  background: rgb(255 255 255 / 0.07);
  font-weight: 700;
  color: #fff;
  color-scheme: dark;
}
.app-select-trigger-dark:hover {
  border-color: rgb(255 255 255 / 0.25);
  background: rgb(255 255 255 / 0.12);
}
.app-select-trigger-dark:focus-visible,
.app-select-trigger-dark.app-select-trigger-open {
  border-color: hsl(var(--accent) / 0.7);
  box-shadow: 0 0 0 3px hsl(var(--accent) / 0.25);
}
.app-select-trigger-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.app-select-panel {
  overflow-y: auto;
  border-radius: 0.9rem;
  padding: 0.35rem;
  scrollbar-width: thin;
  outline: none;
}
.app-select-panel-default {
  border: 1px solid hsl(var(--border) / 0.8);
  background: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  box-shadow: 0 22px 48px -18px hsl(166 32% 14% / 0.4);
}
.app-select-panel-dark {
  border: 1px solid rgb(255 255 255 / 0.14);
  background: #101a16;
  color: rgb(255 255 255 / 0.92);
  box-shadow: 0 24px 56px -18px rgb(0 0 0 / 0.75);
}

.app-select-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 42px;
  border-radius: 0.65rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}
.app-select-option-default {
  color: hsl(var(--foreground) / 0.85);
}
.app-select-option-default.app-select-option-active {
  background: hsl(var(--secondary));
  color: hsl(var(--foreground));
}
.app-select-option-default.app-select-option-selected {
  color: hsl(var(--accent));
}
.app-select-option-dark {
  color: rgb(255 255 255 / 0.85);
}
.app-select-option-dark.app-select-option-active {
  background: rgb(255 255 255 / 0.09);
  color: #fff;
}
.app-select-option-dark.app-select-option-selected {
  color: hsl(var(--accent));
}

.app-select-panel-enter-active,
.app-select-panel-leave-active {
  transition:
    opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.app-select-panel-enter-from,
.app-select-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .app-select-panel-enter-active,
  .app-select-panel-leave-active,
  .app-select-trigger {
    transition: none;
  }
}
</style>

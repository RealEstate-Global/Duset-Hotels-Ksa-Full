<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch, useId } from 'vue'
import { usePopover } from '@/composables/usePopover'

const props = withDefaults(
  defineProps<{
    text: string
    delay?: number
    disabled?: boolean
  }>(),
  {
    delay: 150,
    disabled: false,
  },
)

const open = ref(false)
const tooltipId = useId()
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
let showTimer: number | undefined

const { panelStyle } = usePopover(trigger, open, panel, {
  offset: 8,
  flipThreshold: 60,
  estimatedHeight: 30,
})

const show = () => {
  if (props.disabled) return
  window.clearTimeout(showTimer)
  showTimer = window.setTimeout(() => {
    open.value = true
  }, props.delay)
}
const hide = () => {
  window.clearTimeout(showTimer)
  open.value = false
}
const toggle = () => (open.value ? hide() : show())

const onFocus = () => show()
const onBlur = () => hide()
const onPointerDown = (event: PointerEvent) => {
  if (!trigger.value?.contains(event.target as Node)) return
  // Toggle on touch devices (no hover).
  if (event.pointerType === 'touch') {
    event.preventDefault()
    toggle()
  }
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') hide()
}

watch(open, async (openNow) => {
  if (openNow) await nextTick()
})

onBeforeUnmount(() => window.clearTimeout(showTimer))
</script>

<template>
  <span
    ref="trigger"
    class="inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="onFocus"
    @focusout="onBlur"
    @pointerdown="onPointerDown"
    @keydown="onKeydown"
  >
    <slot />
    <Teleport to="body">
      <div
        v-if="open"
        :id="tooltipId"
        ref="panel"
        role="tooltip"
        class="pointer-events-none whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold leading-4 text-primary-foreground shadow-float"
        :style="panelStyle"
      >
        {{ text }}
      </div>
    </Teleport>
  </span>
</template>

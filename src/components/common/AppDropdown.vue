<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePopover } from '@/composables/usePopover'

const props = withDefaults(
  defineProps<{
    align?: 'start' | 'end'
    width?: 'sm' | 'md' | 'lg' | 'xl'
    label?: string
    panelClass?: string
    closeOnRouteChange?: boolean
    triggerClass?: string
    panelRole?: 'menu' | 'dialog' | 'region'
  }>(),
  {
    align: 'end',
    width: 'md',
    closeOnRouteChange: true,
    panelRole: 'menu',
  },
)

const route = useRoute()
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const { panelStyle } = usePopover(root, isOpen, panel, {
  offset: 10,
  flipThreshold: 200,
  estimatedHeight: 260,
  align: props.align,
})

const close = () => {
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

watch(
  () => route.fullPath,
  () => {
    if (props.closeOnRouteChange) close()
  },
)
</script>

<template>
  <div ref="root" class="relative">
    <!-- Trigger -->
    <button
      type="button"
      class="app-dropdown-trigger"
      :class="triggerClass"
      :aria-expanded="isOpen"
      :aria-haspopup="panelRole === 'menu' ? 'menu' : 'dialog'"
      :aria-label="label"
      @click="toggle"
    >
      <slot name="trigger" :open="isOpen" :toggle="toggle" />
    </button>

    <!-- Panel -->
    <Teleport to="body">
      <Transition name="app-dropdown-panel">
        <div
          v-if="isOpen"
          ref="panel"
          :role="panelRole"
          class="app-dropdown-panel"
          :class="[
            align === 'end' ? 'app-dropdown-panel-end' : 'app-dropdown-panel-start',
            {
              'w-48 sm:w-56': width === 'sm',
              'w-56 sm:w-64': width === 'md',
              'w-64 sm:w-72': width === 'lg',
              'w-[min(92vw,22rem)]': width === 'xl',
            },
            panelClass,
          ]"
          :style="panelStyle"
        >
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.app-dropdown-panel {
  overflow: hidden;
  border-radius: 1.1rem;
  border: 1px solid hsl(var(--border) / 0.8);
  background: hsl(var(--card) / 0.97);
  color: hsl(var(--card-foreground));
  box-shadow: 0 26px 60px -20px hsl(166 32% 14% / 0.45);
  backdrop-filter: blur(14px);
}
.app-dropdown-panel-start {
  transform-origin: top left;
}
.app-dropdown-panel-end {
  transform-origin: top right;
}
[dir='rtl'] .app-dropdown-panel-start {
  transform-origin: top right;
}
[dir='rtl'] .app-dropdown-panel-end {
  transform-origin: top left;
}

.app-dropdown-panel-enter-active,
.app-dropdown-panel-leave-active {
  transition:
    opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.app-dropdown-panel-enter-from,
.app-dropdown-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .app-dropdown-panel-enter-active,
  .app-dropdown-panel-leave-active {
    transition: none;
  }
}
</style>

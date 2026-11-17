<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    variant?: 'accent' | 'primary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    block?: boolean
    to?: RouteLocationRaw
  }>(),
  {
    variant: 'accent',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    block: false,
  },
)

defineEmits<{ click: [event: MouseEvent] }>()

const classes = computed(() => [
  props.size === 'sm' ? 'app-btn-sm' : props.size === 'lg' ? 'app-btn-lg' : 'app-btn-md',
  `app-btn-${props.variant}`,
  { 'app-btn-block': props.block },
])
</script>

<template>
  <RouterLink v-if="to" :to="to" class="app-btn" :class="classes">
    <slot />
  </RouterLink>
  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    class="app-btn"
    :class="classes"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="app-btn-spinner"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
    </svg>
    <slot />
  </button>
</template>

<style scoped>
.app-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: 9999px;
  font-weight: 700;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  outline: none;
  cursor: pointer;
  transition:
    background 200ms ease,
    color 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease,
    transform 200ms ease;
}
.app-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.app-btn:active:not(:disabled) {
  transform: scale(0.98);
}
.app-btn-block {
  width: 100%;
}

.app-btn-sm {
  min-height: 40px;
  padding: 0 1.1rem;
  font-size: 0.8125rem;
}
.app-btn-md {
  min-height: 48px;
  padding: 0 1.6rem;
  font-size: 0.875rem;
}
.app-btn-lg {
  min-height: 56px;
  padding: 0 2rem;
  font-size: 0.9375rem;
}

.app-btn-accent {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
  box-shadow: 0 14px 34px -18px hsl(var(--accent) / 0.65);
}
.app-btn-accent:hover:not(:disabled) {
  background: hsl(var(--accent) / 0.9);
  transform: translateY(-2px);
  box-shadow: 0 18px 40px -16px hsl(var(--accent) / 0.7);
}

.app-btn-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
.app-btn-primary:hover:not(:disabled) {
  background: hsl(var(--primary) / 0.9);
  transform: translateY(-2px);
}

.app-btn-outline {
  border-color: hsl(var(--border));
  background: transparent;
  color: hsl(var(--foreground) / 0.85);
}
.app-btn-outline:hover:not(:disabled) {
  border-color: hsl(var(--accent) / 0.6);
  color: hsl(var(--accent));
}

.app-btn-ghost {
  background: transparent;
  color: hsl(var(--foreground) / 0.75);
}
.app-btn-ghost:hover:not(:disabled) {
  background: hsl(var(--secondary));
  color: hsl(var(--foreground));
}

.app-btn-danger {
  background: hsl(0 72% 55%);
  color: #fff;
}
.app-btn-danger:hover:not(:disabled) {
  background: hsl(0 72% 45%);
}

.app-btn-spinner {
  height: 1.1em;
  width: 1.1em;
  animation: app-btn-spin 800ms linear infinite;
}
@keyframes app-btn-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-btn-spinner {
    animation: none;
  }
  .app-btn {
    transition: none;
  }
}
</style>

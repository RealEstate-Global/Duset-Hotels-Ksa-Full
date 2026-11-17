<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    variant?: 'ghost' | 'outline' | 'solid'
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  {
    variant: 'ghost',
    size: 'md',
    disabled: false,
  },
)

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :disabled="disabled"
    class="app-icon-button"
    :class="[
      variant === 'outline' ? 'app-icon-button-outline' : variant === 'solid' ? 'app-icon-button-solid' : '',
      size === 'sm' ? 'app-icon-button-sm' : 'app-icon-button-md',
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-icon-button {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  outline: none;
  transition:
    background 180ms ease,
    color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}
.app-icon-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.app-icon-button:active:not(:disabled) {
  transform: scale(0.94);
}
.app-icon-button-md {
  height: 2.75rem;
  width: 2.75rem;
}
.app-icon-button-sm {
  height: 2.25rem;
  width: 2.25rem;
}
.app-icon-button:not(.app-icon-button-outline):not(.app-icon-button-solid) {
  color: hsl(var(--muted-foreground));
}
.app-icon-button:not(.app-icon-button-outline):not(.app-icon-button-solid):hover {
  background: hsl(var(--secondary));
  color: hsl(var(--foreground));
}
.app-icon-button-outline {
  border: 1px solid hsl(var(--border));
  color: hsl(var(--foreground) / 0.75);
}
.app-icon-button-outline:hover {
  border-color: hsl(var(--accent) / 0.5);
  color: hsl(var(--accent));
}
.app-icon-button-solid {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
.app-icon-button-solid:hover {
  background: hsl(var(--accent) / 0.88);
  box-shadow: 0 10px 26px -14px hsl(var(--accent) / 0.6);
}
</style>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number | string
    variant?: 'accent' | 'neutral' | 'success' | 'danger'
  }>(),
  {
    variant: 'accent',
  },
)
</script>

<template>
  <span
    class="app-badge"
    :class="{
      'app-badge-accent': variant === 'accent',
      'app-badge-neutral': variant === 'neutral',
      'app-badge-success': variant === 'success',
      'app-badge-danger': variant === 'danger',
    }"
  >
    <slot>{{ count }}</slot>
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  min-width: 1.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 0 0.4rem;
  height: 1.25rem;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
}
.app-badge-accent {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
.app-badge-neutral {
  background: hsl(var(--secondary));
  color: hsl(var(--foreground) / 0.75);
}
.app-badge-success {
  background: hsl(151 38% 34% / 0.15);
  color: hsl(151 38% 34%);
}
.app-badge-danger {
  background: hsl(0 70% 50% / 0.12);
  color: hsl(0 70% 45%);
}
</style>

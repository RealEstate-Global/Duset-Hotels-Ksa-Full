<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <span class="app-chip" :class="{ 'app-chip-active': active }">
    <slot />
  </span>
</template>

<style scoped>
.app-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 9999px;
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
  padding: 0.25rem 0.7rem;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition:
    background 180ms,
    color 180ms;
}
.app-chip-active {
  background: hsl(var(--accent) / 0.14);
  color: hsl(var(--accent));
}
</style>

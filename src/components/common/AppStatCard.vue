<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  label: string
  value: string | number
  iconClass?: string
  trend?: string
}>()
</script>

<template>
  <div class="dash-stat">
    <span class="dash-stat-icon" :class="iconClass">
      <component :is="icon" :size="19" />
    </span>
    <p class="dash-stat-value">{{ value }}</p>
    <p class="dash-stat-label">{{ label }}</p>
    <p v-if="trend" class="text-[10px] font-semibold text-muted-foreground">{{ trend }}</p>
  </div>
</template>

<style scoped>
.dash-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-radius: 1.1rem;
  border: 1px solid hsl(var(--border) / 0.7);
  background: hsl(var(--card));
  padding: 0.9rem;
  transition:
    transform 250ms,
    box-shadow 250ms;
}
.dash-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px -24px hsl(var(--accent) / 0.35);
}
.dash-stat-icon {
  display: flex;
  height: 2.4rem;
  width: 2.4rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.7rem;
}
.dash-stat-value {
  margin-top: 0.35rem;
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.4rem, 2.4vw, 1.8rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
}
.dash-stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: hsl(var(--muted-foreground));
  font-weight: 700;
}
</style>

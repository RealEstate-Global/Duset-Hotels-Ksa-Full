<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { size: 'md' },
)

const initials = computed(() =>
  props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(''),
)

const sizeClass = computed(
  () =>
    ({
      xs: 'h-7 w-7 text-[9px]',
      sm: 'h-8 w-8 text-[10px]',
      md: 'h-10 w-10 text-xs',
      lg: 'h-12 w-12 text-sm',
      xl: 'h-16 w-16 text-xl',
    })[props.size],
)
</script>

<template>
  <span
    class="flex shrink-0 select-none items-center justify-center rounded-full bg-accent font-display font-black text-accent-foreground"
    :class="sizeClass"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>

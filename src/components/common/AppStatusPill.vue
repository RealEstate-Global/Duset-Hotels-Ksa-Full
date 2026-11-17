<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    status: 'confirmed' | 'cancelled'
    label: string
    variant?: 'soft' | 'solid'
    size?: 'sm' | 'md'
    withIcon?: boolean
  }>(),
  {
    variant: 'soft',
    size: 'sm',
    withIcon: false,
  },
)
</script>

<template>
  <span
    class="inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-black uppercase tracking-[0.14em]"
    :class="[
      variant === 'solid'
        ? status === 'confirmed'
          ? 'bg-emerald-600/85 text-white backdrop-blur'
          : 'bg-rose-600/85 text-white backdrop-blur'
        : status === 'confirmed'
          ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
          : 'bg-rose-500/12 text-rose-500',
      size === 'md' ? 'px-4 py-2 text-[10px]' : 'px-2.5 py-1 text-[9px]',
    ]"
  >
    <template v-if="withIcon">
      <Check v-if="status === 'confirmed'" :size="12" :stroke-width="3.5" aria-hidden="true" />
      <X v-else :size="12" :stroke-width="3.5" aria-hidden="true" />
    </template>
    {{ label }}
  </span>
</template>

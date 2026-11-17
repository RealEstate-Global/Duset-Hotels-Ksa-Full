<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    icon?: Component
    title: string
    description?: string
  }>(),
  {
    icon: Inbox,
  },
)
</script>

<template>
  <div class="rounded-2xl border border-dashed border-border bg-secondary/25 px-6 py-14 text-center sm:py-16">
    <component :is="icon" :size="36" class="mx-auto text-muted-foreground" :stroke-width="1.5" />
    <p class="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{{ title }}</p>
    <p v-if="description" class="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground/70">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-6 flex flex-wrap justify-center gap-2">
      <slot />
    </div>
  </div>
</template>

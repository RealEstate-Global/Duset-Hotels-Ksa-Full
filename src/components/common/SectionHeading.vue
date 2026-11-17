<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    align?: 'left' | 'center'
  }>(),
  { align: 'left' },
)
</script>

<template>
  <div :class="align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2 class="display-title mt-4 text-h2 text-foreground" v-html="title" />
    <p v-if="description" class="mt-5 text-body-md text-muted-foreground">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    description?: string
  }>(),
  {},
)
</script>

<template>
  <section class="border-b border-border/70 bg-secondary/40 py-16 sm:py-20">
    <div class="container-shell flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
      <div class="max-w-2xl">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1 class="display-title mt-4 text-h1" v-html="title" />
        <p v-if="description" class="mt-6 max-w-md text-body-md text-muted-foreground">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

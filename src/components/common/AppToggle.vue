<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<boolean>({ required: true })
const inputId = useId()
withDefaults(
  defineProps<{
    label?: string
    description?: string
    disabled?: boolean
    name?: string
  }>(),
  { disabled: false },
)
</script>

<template>
  <label class="app-toggle" :class="{ 'app-toggle-disabled': disabled }">
    <input
      :id="inputId"
      v-model="model"
      type="checkbox"
      role="switch"
      class="app-toggle-input"
      :name="name"
      :disabled="disabled"
      :aria-label="label"
    />
    <span class="app-toggle-track" aria-hidden="true">
      <span class="app-toggle-thumb" />
    </span>
    <span v-if="label || $slots.default" class="min-w-0">
      <slot>
        <span class="block text-sm font-bold">{{ label }}</span>
        <span v-if="description" class="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
          {{ description }}
        </span>
      </slot>
    </span>
  </label>
</template>

<style scoped>
.app-toggle {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.app-toggle-disabled {
  opacity: 0.45;
  pointer-events: none;
}
.app-toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.app-toggle-track {
  position: relative;
  display: inline-flex;
  height: 24px;
  width: 44px;
  flex-shrink: 0;
  align-items: center;
  border-radius: 999px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--secondary));
  transition:
    background 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}
.app-toggle-thumb {
  position: absolute;
  top: 2px;
  inset-inline-start: 2px;
  height: 18px;
  width: 18px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.3);
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.app-toggle-input:checked + .app-toggle-track {
  border-color: hsl(var(--accent));
  background: hsl(var(--accent));
}
.app-toggle-input:checked + .app-toggle-track .app-toggle-thumb {
  transform: translateX(20px);
}
[dir='rtl'] .app-toggle-input:checked + .app-toggle-track .app-toggle-thumb {
  transform: translateX(-20px);
}
.app-toggle-input:focus-visible + .app-toggle-track {
  box-shadow: 0 0 0 3px hsl(var(--accent) / 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .app-toggle-track,
  .app-toggle-thumb {
    transition: none;
  }
}
</style>

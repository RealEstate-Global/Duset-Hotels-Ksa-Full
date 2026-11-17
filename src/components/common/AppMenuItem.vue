<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to?: string | { path: string; query?: Record<string, string> }
    href?: string
    icon?: Component
    danger?: boolean
    external?: boolean
  }>(),
  {
    danger: false,
    external: false,
  },
)

const emit = defineEmits<{ click: [] }>()
const router = useRouter()

const iconComponent = computed(() => props.icon)
const isLink = computed(() => Boolean(props.to || props.href))

const activate = () => {
  emit('click')
  if (props.to) {
    router.push(typeof props.to === 'string' ? props.to : props.to)
  } else if (props.href) {
    window.open(props.href, '_blank', 'noopener,noreferrer')
  }
}
</script>

<template>
  <button
    v-if="!isLink"
    type="button"
    role="menuitem"
    class="app-menu-item"
    :class="{ 'app-menu-item-danger': danger }"
    @click="activate"
  >
    <component :is="iconComponent" v-if="iconComponent" :size="17" class="app-menu-item-icon" aria-hidden="true" />
    <span class="min-w-0 flex-1 text-left rtl:text-right"><slot /></span>
  </button>
  <RouterLink
    v-else-if="to"
    :to="to"
    role="menuitem"
    class="app-menu-item"
    :class="{ 'app-menu-item-danger': danger }"
    @click="emit('click')"
  >
    <component :is="iconComponent" v-if="iconComponent" :size="17" class="app-menu-item-icon" aria-hidden="true" />
    <span class="min-w-0 flex-1"><slot /></span>
  </RouterLink>
  <a
    v-else
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    role="menuitem"
    class="app-menu-item"
    :class="{ 'app-menu-item-danger': danger }"
    @click="emit('click')"
  >
    <component :is="iconComponent" v-if="iconComponent" :size="17" class="app-menu-item-icon" aria-hidden="true" />
    <span class="min-w-0 flex-1"><slot /></span>
  </a>
</template>

<style scoped>
.app-menu-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  border-radius: 0.75rem;
  padding: 0.6rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: hsl(var(--foreground) / 0.8);
  text-align: inherit;
  transition:
    background 160ms ease,
    color 160ms ease;
}
.app-menu-item:hover,
.app-menu-item:focus-visible {
  background: hsl(var(--secondary));
  color: hsl(var(--foreground));
  outline: none;
}
.app-menu-item-icon {
  color: hsl(var(--accent));
  flex-shrink: 0;
}
.app-menu-item-danger {
  color: hsl(0 72% 52%);
}
.app-menu-item-danger:hover,
.app-menu-item-danger:focus-visible {
  background: hsl(0 72% 52% / 0.08);
  color: hsl(0 72% 45%);
}
.app-menu-item-danger .app-menu-item-icon {
  color: hsl(0 72% 52%);
}
</style>

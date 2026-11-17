<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowUp } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const SHOW_AFTER_PX = 320
const RADIUS = 22
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const visible = ref(false)
const progress = ref(0)
const maxScroll = ref(0)

const strokeDashOffset = computed(() => CIRCUMFERENCE * (1 - progress.value))

const measureMaxScroll = () => {
  const doc = document.documentElement
  maxScroll.value = Math.max(0, doc.scrollHeight - doc.clientHeight)
}

// Only cheap reads (scrollY) happen per scroll frame; the layout-affecting
// scrollHeight read is cached and refreshed on resize, after mount, and via
// ResizeObserver when the document size changes (e.g. async sections resolve).
const update = () => {
  const max = maxScroll.value
  progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  visible.value = window.scrollY > SHOW_AFTER_PX
}

let scrollTicking = false
const onScroll = () => {
  if (scrollTicking) return
  scrollTicking = true
  window.requestAnimationFrame(() => {
    scrollTicking = false
    update()
  })
}

// Async sections (code-split chunks) can grow the document after the initial
// measurement. ResizeObserver fires post-layout, so re-caching maxScroll here
// does not force synchronous reflows. Coalesced through rAF as well. Kept on
// its own flag so a pending scroll rAF can never swallow a size re-measure.
let sizeTicking = false
const handleSizeChange = () => {
  if (sizeTicking) return
  sizeTicking = true
  window.requestAnimationFrame(() => {
    sizeTicking = false
    measureMaxScroll()
    update()
  })
}

let resizeObserver: ResizeObserver | undefined

const onResize = () => {
  measureMaxScroll()
  update()
}

const toTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  // Defer the layout-affecting measurement out of the initial mount task.
  window.requestAnimationFrame(() => {
    measureMaxScroll()
    update()
  })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleSizeChange)
    resizeObserver.observe(document.documentElement)
    resizeObserver.observe(document.body)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <Transition name="scroll-top">
    <button
      v-if="visible"
      class="group fixed bottom-5 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-border/80 bg-background/90 shadow-card backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:bottom-7 sm:left-6"
      :aria-label="t('ui.scrollTop.ariaLabel')"
      @click="toTop"
    >
      <svg
        class="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 56 56"
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--border))" stroke-width="3" />
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke="hsl(var(--accent))"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="strokeDashOffset"
        />
      </svg>
      <ArrowUp
        :size="20"
        :stroke-width="2"
        class="relative text-foreground transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  </Transition>
</template>

<style scoped>
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition:
    opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.85);
}
@media (prefers-reduced-motion: reduce) {
  .scroll-top-enter-active,
  .scroll-top-leave-active {
    transition: none;
  }
}
</style>

import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'

export interface PopoverPlacementOptions {
  /** Gap between trigger and panel in px. */
  offset?: number
  /** Minimum free space below the trigger before flipping above. */
  flipThreshold?: number
  /** Max panel height to use when measuring is not possible yet. */
  estimatedHeight?: number
  /** Which trigger edge anchors the panel. */
  align?: 'start' | 'end'
  /** Force the panel to the trigger's width (listboxes). Otherwise the panel keeps its natural/CSS width. */
  matchTriggerWidth?: boolean
}

/**
 * Fixed-position popover logic shared by AppSelect & AppDropdown.
 * Teleports the panel to <body>, measures the trigger, flips above/below
 * based on available viewport space, clamps horizontally, and keeps the
 * panel attached on scroll/resize. Closes on Escape and outside pointer down.
 */
export function usePopover(
  trigger: Ref<HTMLElement | null>,
  open: Ref<boolean>,
  panel: Ref<HTMLElement | null>,
  options: PopoverPlacementOptions = {},
) {
  const offset = options.offset ?? 8
  const flipThreshold = options.flipThreshold ?? 240
  const estimatedHeight = options.estimatedHeight ?? 240
  const align = options.align ?? 'start'
  const matchTriggerWidth = options.matchTriggerWidth ?? false

  const panelStyle = ref<Record<string, string>>({
    position: 'fixed',
    zIndex: '60',
    visibility: 'hidden',
  })

  const measureAndPlace = () => {
    const triggerEl = trigger.value?.querySelector('button, [role="combobox"]') ?? trigger.value
    const panelEl = panel.value
    if (!triggerEl || !panelEl) return
    const rect = triggerEl.getBoundingClientRect()
    const panelHeight = panelEl.offsetHeight || estimatedHeight
    const viewport = window.innerHeight
    const width = matchTriggerWidth ? Math.max(rect.width, 180) : Math.min(panelEl.offsetWidth || 240, window.innerWidth - 16)
    const below = viewport - rect.bottom - offset
    const above = rect.top - offset
    const openUp = below < flipThreshold && above > below

    let left = rect.left
    const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
    const anchorStart = isRtl ? 'end' : 'start'
    const effectiveAlign = align === anchorStart ? 'start' : 'end'
    if (effectiveAlign === 'end') left = rect.right - width
    const maxLeft = window.innerWidth - width - 8
    left = Math.max(8, Math.min(left, maxLeft))

    let top = openUp ? rect.top - panelHeight - offset : rect.bottom + offset
    // Clamp vertically so the panel is never placed outside the viewport.
    top = Math.max(8, Math.min(top, viewport - panelHeight - 8))

    panelStyle.value = {
      position: 'fixed',
      zIndex: '60',
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      ...(matchTriggerWidth ? { width: `${Math.round(width)}px` } : {}),
      visibility: 'visible',
    }
  }

  const close = () => {
    open.value = false
  }

  const onScrollOrResize = () => {
    if (open.value) measureAndPlace()
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open.value) {
      event.preventDefault()
      event.stopPropagation()
      close()
      triggerElFocus()
    }
  }

  const triggerElFocus = () => {
    const el = trigger.value?.querySelector('button, [role="combobox"]')
    if (el instanceof HTMLElement) el.focus()
  }

  const onPointerDownOutside = (event: PointerEvent) => {
    const target = event.target as Node
    if (trigger.value?.contains(target)) return
    if (panel.value?.contains(target)) return
    close()
  }

  watch(open, async (openNow) => {
    if (openNow) {
      // Bring an off-screen trigger into view so the panel anchors somewhere visible.
      const triggerEl = trigger.value?.querySelector('button, [role="combobox"]') ?? trigger.value
      triggerEl?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
      // Place offscreen first so we can measure, then snap into position.
      panelStyle.value = { position: 'fixed', zIndex: '60', left: '0px', top: '0px', visibility: 'hidden' }
      await nextTick()
      await nextTick()
      measureAndPlace()
      document.addEventListener('pointerdown', onPointerDownOutside, true)
      document.addEventListener('keydown', onKeydown, true)
      window.addEventListener('scroll', onScrollOrResize, true)
      window.addEventListener('resize', onScrollOrResize)
    } else {
      document.removeEventListener('pointerdown', onPointerDownOutside, true)
      document.removeEventListener('keydown', onKeydown, true)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDownOutside, true)
    document.removeEventListener('keydown', onKeydown, true)
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
  })

  return { panelStyle, measureAndPlace, close, triggerElFocus }
}

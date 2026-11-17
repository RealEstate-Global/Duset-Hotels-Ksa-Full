<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    min?: string
    localeCode?: string
    disableBefore?: string
  }>(),
  {},
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [value: string]
}>()

const { locale } = useI18n()
const dateLocale = computed(() => props.localeCode ?? (locale.value === 'ar' ? 'ar-SA' : 'en-SA'))

const parseIso = (iso?: string) => {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

const isoDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const today = new Date()
const todayIso = isoDate(today)
const minDate = parseIso(props.min ?? todayIso) ?? today
const disabledBefore = parseIso(props.disableBefore ?? todayIso) ?? today

const selected = computed(() => parseIso(props.modelValue))
const viewDate = ref(selected.value ?? new Date(today.getFullYear(), today.getMonth(), 1))

watch(
  () => props.modelValue,
  (next) => {
    const parsed = parseIso(next)
    if (parsed) viewDate.value = new Date(parsed.getFullYear(), parsed.getMonth(), 1)
  },
)

const monthName = computed(() =>
  new Intl.DateTimeFormat(dateLocale.value, { month: 'long', year: 'numeric' }).format(viewDate.value),
)
const weekdayLabels = computed(() => {
  const formatter = new Intl.DateTimeFormat(dateLocale.value, { weekday: 'narrow' })
  const dayIndex = getFirstDayOfWeek()
  // 2024-01-07 was a Sunday (day 0 in JS numbering).
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(2024, 0, 7 + dayIndex + i)),
  )
})

const getFirstDayOfWeek = () => {
  // ar-SA starts weeks on Saturday (6); en-SA starts on Sunday (7? actually 0=Sun convention).
  try {
    const locale = new Intl.Locale(dateLocale.value) as Intl.Locale & {
      weekInfo?: { firstDay?: number }
      getWeekInfo?: () => { firstDay?: number }
    }
    const info = locale.weekInfo ?? locale.getWeekInfo?.()
    if (typeof info?.firstDay === 'number') return info.firstDay % 7
  } catch {
    /* fallback to Sunday */
  }
  return 0
}

const cells = computed(() => {
  const first = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
  const startWeekday = (first.getDay() - getFirstDayOfWeek() + 7) % 7
  const daysInMonth = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 0).getDate()
  const prevMonthDays = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 0).getDate()
  const days: Array<{ date: Date; iso: string; inMonth: boolean; disabled: boolean; isToday: boolean; isSelected: boolean }> = []
  for (let i = 0; i < 42; i++) {
    let date: Date
    let inMonth = true
    if (i < startWeekday) {
      date = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, prevMonthDays - startWeekday + 1 + i)
      inMonth = false
    } else if (i < startWeekday + daysInMonth) {
      date = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), i - startWeekday + 1)
    } else {
      date = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, i - startWeekday - daysInMonth + 1)
      inMonth = false
    }
    const iso = isoDate(date)
    days.push({
      date,
      iso,
      inMonth,
      disabled: date < disabledBefore,
      isToday: iso === todayIso,
      isSelected: props.modelValue === iso,
    })
  }
  return days
})

const canPrev = computed(() => {
  const prevLast = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 0)
  return prevLast >= minDate
})

const prevMonth = () => {
  if (!canPrev.value) return
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}
const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

const choose = (day: (typeof cells.value)[number]) => {
  if (day.disabled) return
  emit('update:modelValue', day.iso)
  emit('select', day.iso)
}
</script>

<template>
  <div class="w-full select-none">
    <div class="flex items-center justify-between">
      <p class="font-display text-sm font-bold">{{ monthName }}</p>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-30"
          :disabled="!canPrev"
          aria-label="Previous month"
          @click="prevMonth"
        >
          <ChevronLeft :size="16" class="icon-flip" />
        </button>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          aria-label="Next month"
          @click="nextMonth"
        >
          <ChevronRight :size="16" class="icon-flip" />
        </button>
      </div>
    </div>

    <div class="mt-2 grid grid-cols-7 gap-1" role="grid">
      <div
        v-for="(label, index) in weekdayLabels"
        :key="index"
        class="flex h-8 items-center justify-center text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
        role="columnheader"
      >
        {{ label }}
      </div>
      <button
        v-for="day in cells"
        :key="day.iso"
        type="button"
        role="gridcell"
        class="app-calendar-day"
        :class="{
          'app-calendar-day-outside': !day.inMonth,
          'app-calendar-day-today': day.isToday,
          'app-calendar-day-selected': day.isSelected,
        }"
        :disabled="day.disabled"
        :aria-selected="day.isSelected"
        @click="choose(day)"
      >
        {{ day.date.getDate() }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.app-calendar-day {
  display: flex;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.6rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: hsl(var(--foreground) / 0.9);
  transition:
    background 150ms,
    color 150ms,
    transform 150ms;
}
.app-calendar-day:hover:not(:disabled) {
  background: hsl(var(--secondary));
  transform: scale(1.06);
}
.app-calendar-day-outside {
  color: hsl(var(--muted-foreground) / 0.45);
}
.app-calendar-day-today {
  outline: 1px dashed hsl(var(--accent) / 0.6);
  outline-offset: -1px;
}
.app-calendar-day-selected {
  background: hsl(var(--accent)) !important;
  color: hsl(var(--accent-foreground)) !important;
  font-weight: 800;
}
.app-calendar-day:disabled {
  opacity: 0.28;
  cursor: not-allowed;
}
</style>

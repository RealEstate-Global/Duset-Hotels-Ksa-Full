<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowRight,
  CalendarPlus,
  Copy,
  Home,
  Mail,
  Sparkles,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { rooms } from '@/features/rooms/data/rooms'
import { useBookingStore } from '@/features/booking/booking.store'
import { downloadBookingIcs } from '@/features/booking/ics'
import { formatMoney } from '@/features/booking/data/pricing'
import { useToast } from '@/composables/useToast'
import { useAuth } from '@/features/auth/useAuth'

const route = useRoute()
const { t, tm, locale } = useI18n()
const { getBooking } = useBookingStore()
const { isAuthenticated } = useAuth()
const toast = useToast()

const booking = computed(() => getBooking(String(route.params.ref ?? '')))
const localeCode = computed(() => (locale.value === 'ar' ? 'ar-SA' : 'en-SA'))
const money = (amount: number) => formatMoney(amount, localeCode.value)

const roomContent = computed(() => {
  const current = booking.value
  if (!current) return null
  return tm(`rooms.list.${current.roomId}`) as unknown as { name: string; tagline: string }
})
const roomImage = computed(() => rooms.find((room) => room.id === booking.value?.roomId)?.image)

const guestsSummary = computed(() => {
  const current = booking.value
  if (!current) return ''
  return t('booking.confirmation.roomLine', {
    room: roomContent.value?.name ?? '',
    nights: current.nights,
    nightsLabel: current.nights === 1 ? t('booking.dates.night') : t('booking.dates.nights'),
    guests: current.adults + current.children,
  })
})
const datesSummary = computed(() => {
  const current = booking.value
  if (!current) return ''
  return t('booking.confirmation.datesLine', {
    checkIn: current.checkIn,
    checkOut: current.checkOut,
  })
})
const totalSummary = computed(() => {
  const current = booking.value
  if (!current) return ''
  return t('booking.confirmation.totalLine', { total: money(current.total) })
})

const copyRef = async () => {
  if (!booking.value) return
  try {
    await navigator.clipboard.writeText(booking.value.id)
    toast.success(t('booking.confirmation.copied'))
  } catch {
    /* clipboard blocked */
  }
}

const addToCalendar = () => {
  if (!booking.value) return
  downloadBookingIcs(booking.value, roomContent.value?.name ?? 'Room')
}
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <section class="container-shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <!-- Checkmark draw animation -->
      <div class="relative">
        <span class="absolute inset-0 -m-6 animate-ping rounded-full bg-accent/20 [animation-iteration-count:2]" aria-hidden="true" />
        <svg class="relative h-28 w-28" viewBox="0 0 100 100" role="img" :aria-label="t('booking.confirmation.title')">
          <circle class="check-circle" cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--accent))" stroke-width="4.5" stroke-linecap="round" />
          <path class="check-mark" fill="none" stroke="hsl(var(--accent))" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" d="M30 52 L44 66 L72 38" />
        </svg>
      </div>

      <p class="eyebrow mt-8">{{ t('booking.confirmation.eyebrow') }}</p>
      <h1 class="display-title mt-3 text-h1" v-html="t('booking.confirmation.title')" />
      <p class="mx-auto mt-4 max-w-md text-body-md text-muted-foreground">
        {{ t('booking.confirmation.subline', { email: booking?.email ?? '' }) }}
      </p>

      <div v-if="booking" class="mt-8 w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 text-left shadow-card">
        <div class="flex items-center justify-between gap-4">
          <div class="flex min-w-0 items-center gap-4">
            <img v-if="roomImage" :src="roomImage" :alt="roomContent?.name" class="h-20 w-24 shrink-0 rounded-xl object-cover" />
            <div class="min-w-0">
              <p class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.confirmation.refLabel') }}</p>
              <p class="mt-0.5 font-display text-lg font-semibold tracking-[-0.03em]" dir="ltr">{{ booking.id }}</p>
            </div>
          </div>
          <button
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition hover:border-accent hover:text-accent"
            :aria-label="t('dashboard.detail.refCopied')"
            @click="copyRef"
          >
            <Copy :size="16" />
          </button>
        </div>
        <div class="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <p class="font-semibold">{{ guestsSummary }}</p>
          <p class="text-muted-foreground" dir="ltr">{{ datesSummary }}</p>
          <p class="flex items-center gap-1.5 font-bold text-accent"><Sparkles :size="13" />{{ totalSummary }}</p>
        </div>
      </div>

      <!-- What's next -->
      <ol class="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
        <li v-for="(key, index) in ['step1', 'step2', 'step3'] as const" :key="key" class="rounded-2xl border border-border/70 bg-card/60 p-4 text-left">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-display text-xs font-bold text-foreground/80">{{ index + 1 }}</span>
          <p class="mt-2.5 text-[11px] leading-5 text-muted-foreground">{{ t(`booking.confirmation.${key}`) }}</p>
        </li>
      </ol>

      <!-- Actions -->
      <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          v-if="isAuthenticated"
          to="/dashboard/bookings"
          class="inline-flex h-14 items-center gap-2 rounded-2xl bg-accent px-7 text-sm font-bold uppercase tracking-[0.12em] text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
        >
          {{ t('booking.confirmation.actions.manageBookings') }} <ArrowRight :size="16" class="icon-flip" />
        </RouterLink>
        <button
          class="inline-flex h-14 items-center gap-2 rounded-2xl border border-border px-7 text-sm font-bold uppercase tracking-[0.12em] text-foreground/85 transition hover:border-accent hover:text-accent"
          @click="addToCalendar"
        >
          <CalendarPlus :size="17" /> {{ t('booking.confirmation.actions.addToCalendar') }}
        </button>
        <RouterLink
          to="/booking"
          class="inline-flex h-14 items-center gap-2 rounded-2xl px-6 text-sm font-bold text-muted-foreground transition hover:text-foreground"
        >
          {{ t('booking.confirmation.actions.bookAnother') }}
        </RouterLink>
      </div>

      <p v-if="!isAuthenticated" class="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        <Mail :size="14" class="text-accent" /> {{ t('booking.confirmation.manageHint') }}
      </p>

      <RouterLink v-if="!isAuthenticated" to="/" class="link-underline mt-4 inline-flex items-center gap-2 text-xs font-bold">
        <Home :size="13" /> {{ t('booking.confirmation.actions.backHome') }}
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.check-circle {
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  animation: draw 700ms ease-out forwards;
}
.check-mark {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: draw 450ms 650ms ease-out forwards;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .check-circle,
  .check-mark {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>

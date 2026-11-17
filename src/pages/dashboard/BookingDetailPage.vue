<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  CalendarPlus,
  CalendarX2,
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { rooms } from '@/features/rooms/data/rooms'
import { useBookingStore } from '@/features/booking/booking.store'
import { useToast } from '@/composables/useToast'
import { SITE } from '@/constants/site'
import { downloadBookingIcs } from '@/features/booking/ics'
import { formatMoney } from '@/features/booking/data/pricing'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { ref } from 'vue'

const route = useRoute()
const { t, tm, locale } = useI18n()
const { getBooking, cancelBooking } = useBookingStore()
const toast = useToast()

const booking = computed(() => getBooking(String(route.params.ref ?? '')))
const localeCode = computed(() => (locale.value === 'ar' ? 'ar-SA' : 'en-SA'))
const money = (amount: number) => formatMoney(amount, localeCode.value)

const roomName = computed(() => {
  const current = booking.value
  if (!current) return ''
  return (tm(`rooms.list.${current.roomId}`) as unknown as { name: string }).name
})
const roomImage = computed(
  () => rooms.find((room) => room.id === booking.value?.roomId)?.image ?? '',
)

const cancelOpen = ref(false)

const copyRef = async () => {
  if (!booking.value) return
  try {
    await navigator.clipboard.writeText(booking.value.id)
    toast.success(t('dashboard.detail.refCopied'))
  } catch {
    /* blocked */
  }
}

const addToCalendar = () => {
  if (!booking.value) return
  downloadBookingIcs(booking.value, roomName.value || 'Room')
}

const confirmCancel = () => {
  if (booking.value) {
    cancelBooking(booking.value.id)
    toast.info(t('dashboard.bookings.cancelledToast'))
  }
  cancelOpen.value = false
}

const canCancel = computed(
  () =>
    booking.value?.status === 'confirmed' &&
    new Date(booking.value.checkOut).getTime() >= Date.now(),
)

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(localeCode.value, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${iso}T00:00:00`),
  )
</script>

<template>
  <div v-if="booking">
    <!-- Header -->
    <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <RouterLink to="/dashboard/bookings" class="link-underline inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft :size="14" class="icon-flip" /> {{ t('dashboard.sidebar.myBookings') }}
        </RouterLink>
        <h1 class="display-title mt-2 text-h3">{{ t('dashboard.detail.title') }}</h1>
        <button class="mt-2 inline-flex items-center gap-2 font-mono text-sm font-bold text-accent transition hover:text-accent/80" dir="ltr" @click="copyRef">
          {{ booking.id }} <Copy :size="14" />
        </button>
      </div>
      <span
        class="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]"
        :class="booking.status === 'confirmed' ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/12 text-rose-500'"
      >
        <Check :size="12" :stroke-width="3.5" /> {{ t(`dashboard.bookings.status.${booking.status}`) }}
      </span>
    </div>

    <!-- Cancelled banner -->
    <div v-if="booking.status === 'cancelled'" class="mt-5 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-500">
      <CalendarX2 :size="16" class="shrink-0" /> {{ t('dashboard.detail.cancelledBanner') }}
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <!-- Left column -->
      <div class="space-y-6">
        <!-- Room -->
        <section class="overflow-hidden rounded-2xl border border-border/80 bg-card">
          <div class="relative h-44 sm:h-52">
            <img :src="roomImage" :alt="roomName" class="absolute inset-0 h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <p class="absolute bottom-4 left-4 right-4 font-display text-xl font-semibold text-white">{{ roomName }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-x-5 gap-y-3 p-5 text-xs font-semibold text-foreground/85">
            <span class="flex items-center gap-1.5" dir="ltr"><CalendarPlus :size="15" class="text-accent" /> {{ formatDate(booking.checkIn) }} → {{ formatDate(booking.checkOut) }}</span>
            <span class="flex items-center gap-1.5"><Users :size="15" class="text-accent" /> {{ booking.adults + booking.children }}</span>
            <span class="flex items-center gap-1.5"><Phone :size="15" class="text-accent" /> {{ booking.arrivalTime }}</span>
          </div>
        </section>

        <!-- Guest info -->
        <section class="rounded-2xl border border-border/80 bg-card p-5">
          <h2 class="flex items-center gap-2 text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <UserRound :size="14" class="text-accent" /> {{ t('dashboard.detail.guestInfo') }}
          </h2>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{{ t('booking.details.fullName') }}</p>
              <p class="mt-1 text-sm font-bold">{{ booking.guestName }}</p>
            </div>
            <div class="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{{ t('booking.details.email') }}</p>
              <p class="mt-1 break-all text-sm font-bold" dir="ltr">{{ booking.email }}</p>
            </div>
            <div class="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{{ t('booking.details.phone') }}</p>
              <p class="mt-1 text-sm font-bold" dir="ltr">{{ booking.phone }}</p>
            </div>
            <div class="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{{ t('booking.details.requests') }}</p>
              <p class="mt-1 text-sm leading-5 text-foreground/80">{{ booking.requests || '—' }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Right column -->
      <div class="space-y-6">
        <!-- Price breakdown -->
        <section class="rounded-2xl border border-border/80 bg-card p-5">
          <h2 class="text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">{{ t('dashboard.detail.priceBreakdown') }}</h2>
          <dl class="mt-4 space-y-2.5 text-sm">
            <div class="flex items-center justify-between text-muted-foreground">
              <dt>{{ t('dashboard.detail.ratePerNight', { rate: money(booking.ratePerNight) }) }} × {{ booking.nights }}</dt>
              <dd class="font-semibold text-foreground" dir="ltr">{{ money(booking.ratePerNight * booking.nights) }}</dd>
            </div>
            <div v-if="booking.discount > 0" class="flex items-center justify-between text-accent">
              <dt>{{ t('dashboard.detail.discount') }}</dt>
              <dd class="font-semibold" dir="ltr">−{{ money(booking.discount) }}</dd>
            </div>
            <div class="flex items-center justify-between text-muted-foreground">
              <dt>{{ t('dashboard.detail.vat') }}</dt>
              <dd class="font-semibold text-foreground" dir="ltr">{{ money(booking.vat) }}</dd>
            </div>
            <div class="border-t border-border pt-3">
              <div class="flex items-end justify-between gap-4">
                <dt class="text-caption font-bold uppercase text-muted-foreground">{{ t('dashboard.detail.total') }}</dt>
                <dd class="font-display text-xl font-semibold tracking-[-0.04em]" dir="ltr">{{ money(booking.total) }}</dd>
              </div>
            </div>
          </dl>
        </section>

        <!-- Actions -->
        <section class="rounded-2xl border border-border/80 bg-card p-5">
          <h2 class="text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">{{ t('dashboard.detail.title') }}</h2>
          <div class="mt-4 grid gap-2">
            <a
              :href="SITE.phones[0].href"
              class="flex items-center gap-3 rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-xs font-bold text-foreground/85 transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
            >
              <Phone :size="16" class="text-accent" /> {{ t('dashboard.detail.actions.contactHotel') }}
            </a>
            <a
              :href="SITE.mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-xs font-bold text-foreground/85 transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
            >
              <MapPin :size="16" class="text-accent" /> {{ t('dashboard.detail.actions.getDirections') }}
            </a>
            <button
              class="flex items-center gap-3 rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-xs font-bold text-foreground/85 transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
              @click="addToCalendar"
            >
              <CalendarPlus :size="16" class="text-accent" /> {{ t('dashboard.detail.actions.addToCalendar') }}
            </button>
            <a
              :href="SITE.emailHref"
              class="flex items-center gap-3 rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-xs font-bold text-foreground/85 transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
            >
              <Mail :size="16" class="text-accent" /> {{ SITE.email }}
            </a>
            <button
              v-if="canCancel"
              class="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-xs font-bold text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-500/10"
              @click="cancelOpen = true"
            >
              <CalendarX2 :size="16" /> {{ t('dashboard.detail.actions.cancelBooking') }}
            </button>
          </div>
          <p class="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
            <ShieldCheck :size="12" class="text-accent" /> {{ t('booking.summary.freeCancellation') }}
          </p>
        </section>
      </div>
    </div>

    <ConfirmModal
      :open="cancelOpen"
      :title="t('dashboard.bookings.cancelConfirmTitle')"
      :body="t('dashboard.bookings.cancelConfirmBody')"
      :confirm-label="t('dashboard.bookings.cancelConfirmLabel')"
      :cancel-label="t('dashboard.bookings.cancelKeep')"
      @confirm="confirmCancel"
      @cancel="cancelOpen = false"
    />
  </div>
  <div v-else class="rounded-2xl border border-dashed border-border bg-secondary/25 p-16 text-center">
    <p class="text-sm text-muted-foreground">404</p>
    <RouterLink to="/dashboard/bookings" class="link-underline mt-3 inline-flex text-xs font-bold">{{ t('common.actions.back') }}</RouterLink>
  </div>
</template>

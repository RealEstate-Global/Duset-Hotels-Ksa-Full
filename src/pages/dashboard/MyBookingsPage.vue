<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, CalendarX2, Inbox } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { rooms } from '@/features/rooms/data/rooms'
import { useBookingStore } from '@/features/booking/booking.store'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import AppStatusPill from '@/components/common/AppStatusPill.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'

const { t, tm, locale } = useI18n()
const { bookings, cancelBooking } = useBookingStore()
const toast = useToast()

const localeCode = computed(() => (locale.value === 'ar' ? 'ar-SA' : 'en-SA'))
type TabId = 'all' | 'upcoming' | 'past' | 'cancelled'
const activeTab = ref<TabId>('all')
const cancelTarget = ref<string | null>(null)

const roomName = (id: string) =>
  (tm(`rooms.list.${id}`) as unknown as { name: string } | undefined)?.name ?? id
const roomImage = (id: string) => rooms.find((room) => room.id === id)?.image ?? ''

const isUpcoming = (booking: { status: string; checkOut: string }) =>
  booking.status === 'confirmed' && new Date(booking.checkOut).getTime() >= Date.now()
const isPast = (booking: { status: string; checkOut: string }) =>
  new Date(booking.checkOut).getTime() < Date.now() && booking.status === 'confirmed'

const filtered = computed(() => {
  const all = [...bookings.value].sort((a, b) => b.createdAt - a.createdAt)
  switch (activeTab.value) {
    case 'upcoming':
      return all.filter(isUpcoming)
    case 'past':
      return all.filter(isPast)
    case 'cancelled':
      return all.filter((booking) => booking.status === 'cancelled')
    default:
      return all
  }
})

const counts = computed(() => ({
  all: bookings.value.length,
  upcoming: bookings.value.filter(isUpcoming).length,
  past: bookings.value.filter(isPast).length,
  cancelled: bookings.value.filter((booking) => booking.status === 'cancelled').length,
}))

const tabDefs = computed(
  () =>
    (['all', 'upcoming', 'past', 'cancelled'] as TabId[]).map((id) => ({
      id,
      label: t(`dashboard.bookings.tabs.${id}`),
      count: counts.value[id],
    })),
)

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(localeCode.value, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(`${iso}T00:00:00`),
  )

const requestCancel = (id: string) => {
  cancelTarget.value = id
}

const confirmCancel = () => {
  if (cancelTarget.value) {
    cancelBooking(cancelTarget.value)
    toast.info(t('dashboard.bookings.cancelledToast'))
  }
  cancelTarget.value = null
}
</script>

<template>
  <div>
    <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p class="eyebrow">{{ t('dashboard.sidebar.myBookings') }}</p>
        <h1 class="display-title mt-2 text-h3">{{ t('dashboard.bookings.title') }}</h1>
        <p class="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">{{ t('dashboard.bookings.subline') }}</p>
      </div>
      <RouterLink
        to="/booking"
        class="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-accent px-6 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:-translate-y-0.5 hover:shadow-float"
      >
        {{ t('common.actions.bookNow') }} <ArrowRight :size="15" class="icon-flip" />
      </RouterLink>
    </div>

    <!-- Tabs -->
    <div class="mt-6 overflow-x-auto pb-1">
      <div class="flex min-w-max items-center gap-2 rounded-2xl border border-border/70 bg-card p-1.5" role="tablist">
        <button
          v-for="tab in tabDefs"
          :key="tab.id"
          role="tab"
          :aria-selected="activeTab === tab.id"
          class="flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold uppercase tracking-[0.1em] transition duration-300"
          :class="activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <AppBadge :variant="activeTab === tab.id ? 'accent' : 'neutral'" :count="tab.count" />
        </button>
      </div>
    </div>

    <!-- List -->
    <div v-if="filtered.length" class="mt-5 grid gap-4">
      <article
        v-for="booking in filtered"
        :key="booking.id"
        class="group overflow-hidden rounded-2xl border border-border/80 bg-card transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:flex"
      >
        <div class="relative h-36 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48 lg:w-56">
          <img
            :src="roomImage(booking.roomId)"
            :alt="roomName(booking.roomId)"
            class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <AppStatusPill
            variant="solid"
            class="absolute left-3 top-3"
            :status="booking.status"
            :label="t(`dashboard.bookings.status.${booking.status}`)"
          />
        </div>
        <div class="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-display text-lg font-semibold leading-tight tracking-[-0.03em]">{{ roomName(booking.roomId) }}</p>
              <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground" dir="ltr">{{ booking.id }}</p>
            </div>
            <p class="shrink-0 text-right text-sm font-bold text-foreground/85" dir="ltr">
              {{ new Intl.NumberFormat(localeCode, { style: 'currency', currency: 'SAR', currencyDisplay: 'code', maximumFractionDigits: 0 }).format(booking.total) }}
            </p>
          </div>
          <p class="mt-2 text-xs leading-5 text-muted-foreground" dir="ltr">
            {{ formatDate(booking.checkIn) }} → {{ formatDate(booking.checkOut) }}
          </p>
          <p class="mt-1 text-[11px] font-semibold text-muted-foreground">
            {{ t('dashboard.bookings.card.guests', { count: booking.adults + booking.children }) }} ·
            {{ booking.nights }} {{ booking.nights === 1 ? t('booking.dates.night') : t('booking.dates.nights') }}
          </p>
          <div class="mt-auto flex flex-wrap items-center gap-2 pt-4">
            <RouterLink
              :to="`/dashboard/bookings/${booking.id}`"
              class="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-foreground transition hover:-translate-y-0.5"
            >
              {{ t('dashboard.bookings.card.view') }} <ArrowRight :size="13" class="icon-flip" />
            </RouterLink>
            <button
              v-if="booking.status === 'confirmed' && isUpcoming(booking)"
              class="inline-flex h-10 items-center gap-1.5 rounded-xl border border-rose-500/30 px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-500/10"
              @click="requestCancel(booking.id)"
            >
              <CalendarX2 :size="14" /> {{ t('dashboard.bookings.card.cancel') }}
            </button>
            <RouterLink
              v-else-if="booking.status === 'cancelled' || isPast(booking)"
              to="/booking"
              class="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/75 transition hover:border-accent hover:text-accent"
            >
              {{ t('dashboard.bookings.card.bookAgain') }}
            </RouterLink>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <AppEmptyState v-else class="mt-10" :icon="Inbox" :title="t(`dashboard.bookings.empty.${activeTab}`)">
      <RouterLink to="/booking" class="mt-2 inline-flex h-12 items-center gap-2 rounded-2xl bg-accent px-6 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:-translate-y-0.5">
        {{ t('dashboard.bookings.empty.cta') }} <ArrowRight :size="14" class="icon-flip" />
      </RouterLink>
    </AppEmptyState>

    <ConfirmModal
      :open="cancelTarget !== null"
      :title="t('dashboard.bookings.cancelConfirmTitle')"
      :body="t('dashboard.bookings.cancelConfirmBody')"
      :confirm-label="t('dashboard.bookings.cancelConfirmLabel')"
      :cancel-label="t('dashboard.bookings.cancelKeep')"
      @confirm="confirmCancel"
      @cancel="cancelTarget = null"
    />
  </div>
</template>

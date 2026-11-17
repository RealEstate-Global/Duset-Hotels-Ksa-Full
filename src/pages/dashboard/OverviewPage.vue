<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  ChevronRight,
  ConciergeBell,
  Moon,
  Sparkles,
  Star,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { rooms } from '@/features/rooms/data/rooms'
import { useBookingStore } from '@/features/booking/booking.store'
import { useAuth } from '@/features/auth/useAuth'
import { SITE } from '@/constants/site'
import AppStatusPill from '@/components/common/AppStatusPill.vue'
import AppStatCard from '@/components/common/AppStatCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const { t, tm, locale } = useI18n()
const { user } = useAuth()
const { bookings, upcomingBookings, nightsBooked } = useBookingStore()

const localeCode = computed(() => (locale.value === 'ar' ? 'ar-SA' : 'en-SA'))

const roomName = (id: string) =>
  (tm(`rooms.list.${id}`) as unknown as { name: string } | undefined)?.name ?? id
const roomImage = (id: string) => rooms.find((room) => room.id === id)?.image ?? ''

const next = computed(() => upcomingBookings()[0] ?? null)
const recent = computed(() => [...bookings.value].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3))

const nights = computed(() => nightsBooked())
const points = computed(() => 1250 + nights.value * 50)
const tier = computed(() => {
  if (points.value >= 2000) return { key: 'tierPlatinum', next: null as string | null, progress: 100 }
  if (points.value >= 1200) return { key: 'tierGold', next: 'tierPlatinum', progress: Math.round(((points.value - 1200) / 800) * 100) }
  return { key: 'tierSilver', next: 'tierGold', progress: Math.round((points.value / 1200) * 100) }
})

const daysUntilNext = computed(() => {
  if (!next.value) return 0
  const ms = new Date(next.value.checkIn).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
})

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(localeCode.value, { day: 'numeric', month: 'short' }).format(new Date(`${iso}T00:00:00`))
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p class="eyebrow">{{ t('dashboard.sidebar.overview') }}</p>
        <h1 class="display-title mt-2 text-h3">{{ t('dashboard.overview.greeting', { name: user?.name }) }}</h1>
        <p class="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">{{ t('dashboard.overview.subline') }}</p>
      </div>
      <AppButton to="/booking" variant="accent" size="lg">
        <CalendarDays :size="16" /> {{ t('dashboard.overview.bookRoom') }}
      </AppButton>
    </div>

    <!-- Stats -->
    <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <AppStatCard :icon="CalendarDays" icon-class="bg-sky-500/12 text-sky-500" :value="next ? daysUntilNext : t('dashboard.overview.stats.nextStayNone')" :label="t('dashboard.overview.stats.nextStay')" />
      <AppStatCard :icon="Moon" icon-class="bg-violet-500/12 text-violet-500" :value="nights" :label="t('dashboard.overview.stats.nightsBooked')" />
      <AppStatCard :icon="Sparkles" icon-class="bg-amber-500/12 text-amber-500" :value="points.toLocaleString()" :label="t('dashboard.overview.stats.points')" />
      <AppStatCard :icon="Star" icon-class="bg-accent/15 text-accent" :value="t(`dashboard.overview.stats.${tier.key}`)" :label="t('dashboard.overview.stats.tier')" />
    </div>

    <!-- Loyalty progress -->
    <div class="mt-4 flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Sparkles :size="17" /></span>
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-3 text-[11px] font-bold">
          <span class="text-foreground/80">{{ t('dashboard.overview.stats.points') }}: {{ points.toLocaleString() }}</span>
          <span class="text-muted-foreground">{{ tier.next ? `→ ${t(`dashboard.overview.stats.${tier.next}`)}` : 'MAX' }}</span>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
          <div class="h-full rounded-full bg-gradient-to-r from-accent/70 to-accent transition-all duration-700" :style="{ width: `${tier.progress}%` }" />
        </div>
      </div>
    </div>

    <!-- Next stay -->
    <section class="mt-8">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-lg font-semibold tracking-[-0.03em]">{{ t('dashboard.overview.nextStay.title') }}</h2>
        <RouterLink to="/dashboard/bookings" class="link-underline text-xs font-bold">{{ t('dashboard.overview.recent.viewAll') }}</RouterLink>
      </div>

      <div v-if="next" class="group relative mt-4 overflow-hidden rounded-2xl border border-border/70 shadow-card">
        <img :src="roomImage(next.roomId)" :alt="roomName(next.roomId)" class="h-48 w-full object-cover sm:h-56" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <span class="absolute left-4 top-4 rounded-full bg-accent px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-accent-foreground">
          {{ t('dashboard.overview.nextStay.status') }}
        </span>
        <div class="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 p-5">
          <div>
            <p class="font-display text-xl font-semibold text-white sm:text-2xl">{{ roomName(next.roomId) }}</p>
            <p class="mt-1 text-xs font-semibold text-white/75" dir="ltr">
              {{ formatDate(next.checkIn) }} → {{ formatDate(next.checkOut) }} · {{ next.nights }} {{ next.nights === 1 ? t('booking.dates.night') : t('booking.dates.nights') }}
            </p>
            <p class="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50" dir="ltr">{{ next.id }}</p>
          </div>
          <RouterLink
            :to="`/dashboard/bookings/${next.id}`"
            class="inline-flex h-11 items-center gap-2 rounded-xl bg-white/95 px-5 text-xs font-bold uppercase tracking-[0.12em] text-slate-900 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
          >
            {{ t('dashboard.overview.nextStay.manage') }} <ChevronRight :size="14" class="icon-flip" />
          </RouterLink>
        </div>
      </div>

      <div v-else class="mt-4 rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center">
        <BedDouble :size="34" class="mx-auto text-accent" />
        <p class="mt-3 font-display text-lg font-semibold">{{ t('dashboard.overview.nextStay.noUpcoming') }}</p>
        <p class="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{{ t('dashboard.overview.nextStay.noUpcomingSub') }}</p>
        <RouterLink to="/booking" class="mt-5 inline-flex h-12 items-center gap-2 rounded-2xl bg-accent px-6 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:-translate-y-0.5">
          {{ t('dashboard.overview.nextStay.bookNow') }} <ArrowRight :size="14" class="icon-flip" />
        </RouterLink>
      </div>
    </section>

    <div class="mt-8 grid gap-8 xl:grid-cols-[1.2fr_1fr]">
      <!-- Recent bookings -->
      <section>
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-semibold tracking-[-0.03em]">{{ t('dashboard.overview.recent.title') }}</h2>
          <RouterLink to="/dashboard/bookings" class="link-underline text-xs font-bold">{{ t('dashboard.overview.recent.viewAll') }}</RouterLink>
        </div>
        <div class="mt-4 divide-y divide-border/70 rounded-2xl border border-border/80 bg-card">
          <p v-if="!recent.length" class="p-6 text-center text-sm text-muted-foreground">{{ t('dashboard.overview.recent.empty') }}</p>
          <RouterLink
            v-for="booking in recent"
            :key="booking.id"
            :to="`/dashboard/bookings/${booking.id}`"
            class="flex items-center gap-4 p-4 transition hover:bg-secondary/40"
          >
            <img :src="roomImage(booking.roomId)" :alt="roomName(booking.roomId)" class="h-16 w-20 shrink-0 rounded-xl object-cover" loading="lazy" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold">{{ roomName(booking.roomId) }}</p>
              <p class="mt-0.5 text-[11px] text-muted-foreground" dir="ltr">{{ formatDate(booking.checkIn) }} → {{ formatDate(booking.checkOut) }}</p>
            </div>
            <AppStatusPill :status="booking.status" :label="t(`dashboard.bookings.status.${booking.status}`)" />
          </RouterLink>
        </div>
      </section>

      <!-- Quick actions -->
      <section>
        <h2 class="font-display text-lg font-semibold tracking-[-0.03em]">{{ t('dashboard.overview.quickActions.title') }}</h2>
        <div class="mt-4 grid gap-3">
          <RouterLink to="/booking" class="quick-action">
            <span class="quick-action-icon bg-accent/12 text-accent"><CalendarDays :size="19" /></span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-bold">{{ t('dashboard.overview.quickActions.bookRoom') }}</span>
              <span class="mt-0.5 block text-[11px] text-muted-foreground">{{ t('dashboard.overview.quickActions.bookRoomSub') }}</span>
            </span>
            <ArrowRight :size="16" class="icon-flip shrink-0 text-muted-foreground" />
          </RouterLink>
          <a :href="SITE.whatsappUrl" target="_blank" rel="noopener noreferrer" class="quick-action">
            <span class="quick-action-icon bg-emerald-500/12 text-emerald-500"><ConciergeBell :size="19" /></span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-bold">{{ t('dashboard.overview.quickActions.contact') }}</span>
              <span class="mt-0.5 block text-[11px] text-muted-foreground">{{ t('dashboard.overview.quickActions.contactSub') }}</span>
            </span>
            <ArrowRight :size="16" class="icon-flip shrink-0 text-muted-foreground" />
          </a>
          <RouterLink to="/amenities" class="quick-action">
            <span class="quick-action-icon bg-violet-500/12 text-violet-500"><BedDouble :size="19" /></span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-bold">{{ t('dashboard.overview.quickActions.amenities') }}</span>
              <span class="mt-0.5 block text-[11px] text-muted-foreground">{{ t('dashboard.overview.quickActions.amenitiesSub') }}</span>
            </span>
            <ArrowRight :size="16" class="icon-flip shrink-0 text-muted-foreground" />
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.quick-action {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border-radius: 1.1rem;
  border: 1px solid hsl(var(--border) / 0.7);
  background: hsl(var(--card));
  padding: 0.85rem 0.9rem;
  transition:
    transform 250ms,
    border-color 250ms,
    box-shadow 250ms;
}
.quick-action:hover {
  transform: translateY(-2px);
  border-color: hsl(var(--accent) / 0.4);
  box-shadow: 0 16px 36px -26px hsl(var(--accent) / 0.4);
}
.quick-action-icon {
  display: flex;
  height: 2.6rem;
  width: 2.6rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
}
</style>

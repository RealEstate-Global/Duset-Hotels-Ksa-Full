<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Check,
  ChevronRight,
  ConciergeBell,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { rooms } from '@/features/rooms/data/rooms'
import { isoDate } from '@/features/booking/dates'
import { priceBreakdown, formatMoney, promoDiscountRate, PROMO_CODES } from '@/features/booking/data/pricing'
import { useBookingStore } from '@/features/booking/booking.store'
import { useAuth } from '@/features/auth/useAuth'
import { useToast } from '@/composables/useToast'
import AppSelect from '@/components/common/AppSelect.vue'
import type { SelectOption } from '@/components/common/AppSelect.vue'
import AppDatePicker from '@/components/common/AppDatePicker.vue'
import AppPageHeader from '@/components/common/AppPageHeader.vue'

const route = useRoute()
const router = useRouter()
const { t, tm, locale } = useI18n()
const { createBooking } = useBookingStore()
const { user, isAuthenticated } = useAuth()
const toast = useToast()

const localeCode = computed(() => (locale.value === 'ar' ? 'ar-SA' : 'en-SA'))
const money = (amount: number) => formatMoney(amount, localeCode.value)

// ---------- step state ----------
const step = ref<1 | 2 | 3>(1)
const STEPS = [1, 2, 3] as const

// ---------- selection ----------
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const dayAfter = new Date(tomorrow)
dayAfter.setDate(dayAfter.getDate() + 2)

const initialRoom = () => {
  const q = String(route.query.room ?? '')
  return rooms.some((room) => room.id === q) ? q : rooms[0]?.id ?? ''
}

const selectedRoomId = ref(initialRoom())
const checkIn = ref(String(route.query.checkIn ?? isoDate(tomorrow)))
const checkOut = ref(String(route.query.checkOut ?? isoDate(dayAfter)))
const adults = ref(Math.min(4, Math.max(1, Number(route.query.adults) || 2)))
const children = ref(Math.min(3, Math.max(0, Number(route.query.children) || 0)))

const promoInput = ref('')
const promoApplied = ref<string | null>(null)
const promoError = ref('')
const formError = ref('')
const termsError = ref('')
const submitting = ref(false)

// ---------- guest details ----------
const guestName = ref(user.value?.name ?? '')
const email = ref(user.value?.email ?? '')
const phone = ref(user.value?.phone ?? '')
const arrivalTime = ref('14:00')
const requests = ref('')

watch(isAuthenticated, (loggedIn) => {
  if (!loggedIn || !user.value) return
  if (!guestName.value) guestName.value = user.value.name
  if (!email.value) email.value = user.value.email
  if (!phone.value) phone.value = user.value.phone
})

// ---------- derived ----------
const roomName = (id: string) =>
  (tm(`rooms.list.${id}`) as unknown as { name: string } | undefined)?.name ?? id

const breakdown = computed(() =>
  priceBreakdown(selectedRoomId.value, checkIn.value, checkOut.value, promoApplied.value ?? ''),
)
const nights = computed(() => breakdown.value.nights)
const promoPercent = computed(() =>
  promoApplied.value ? Math.round(promoDiscountRate(promoApplied.value) * 100) : 0,
)
const totalGuests = computed(() => adults.value + children.value)
const canContinueToDetails = computed(
  () => Boolean(selectedRoomId.value) && nights.value >= 1 && totalGuests.value >= 1,
)
const minCheckOut = computed(() => {
  const d = new Date(`${checkIn.value}T00:00:00`)
  d.setDate(d.getDate() + 1)
  return isoDate(d)
})

// ---------- promo ----------
const applyPromo = () => {
  const code = promoInput.value.trim().toUpperCase()
  promoError.value = ''
  if (code && PROMO_CODES[code]) {
    promoApplied.value = code
    promoInput.value = code
    toast.success(t('booking.promo.applied', { code, percent: Math.round(PROMO_CODES[code] * 100) }))
  } else {
    promoApplied.value = null
    promoError.value = t('booking.promo.invalid')
  }
}
const removePromo = () => {
  promoApplied.value = null
  promoInput.value = ''
  promoError.value = ''
}

// ---------- validation ----------
const validateDetails = () => {
  formError.value = ''
  if (!guestName.value.trim()) return (formError.value = t('booking.errors.missingName')), false
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim()))
    return (formError.value = t('booking.errors.invalidEmail')), false
  if (phone.value.trim().replace(/\D/g, '').length < 8)
    return (formError.value = t('booking.errors.missingPhone')), false
  return true
}

// ---------- navigation ----------
const goTo = (target: 1 | 2 | 3) => {
  formError.value = ''
  if (target === 2 && !canContinueToDetails.value) {
    if (!selectedRoomId.value) formError.value = t('booking.errors.selectRoom')
    else if (nights.value < 1) formError.value = t('booking.errors.invalidDates')
    return
  }
  if (target === 3 && !validateDetails()) return
  step.value = target
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const arrivalTimes: SelectOption[] = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((time) => ({
  label: time,
  value: time,
}))

const submit = async () => {
  termsError.value = ''
  if (!termsAccepted.value) {
    termsError.value = t('booking.errors.acceptTerms')
    return
  }
  if (!validateDetails()) {
    step.value = 2
    return
  }
  submitting.value = true
  // Brief processing state for a realistic confirm feel.
  await new Promise((resolve) => window.setTimeout(resolve, 650))
  const booking = createBooking({
    roomId: selectedRoomId.value,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    adults: adults.value,
    children: children.value,
    guestName: guestName.value.trim(),
    email: email.value.trim().toLowerCase(),
    phone: phone.value.trim(),
    arrivalTime: arrivalTime.value,
    requests: requests.value.trim(),
    promo: promoApplied.value,
  })
  submitting.value = false
  router.push({ name: 'booking-confirmation', params: { ref: booking.id } })
}

const termsAccepted = ref(false)
</script>

<template>
  <main class="pb-24 pt-[68px] md:pt-[104px]">
    <!-- Header -->
    <AppPageHeader
      :eyebrow="t('booking.page.eyebrow')"
      :title="t('booking.page.title')"
      :description="t('booking.page.subline')"
    />

    <!-- Steps -->
    <div class="container-shell pt-8">
      <ol class="flex items-center gap-2 sm:gap-4" :aria-label="t('booking.page.eyebrow')">
        <li v-for="n in STEPS" :key="n" class="flex flex-1 items-center gap-2 sm:gap-3">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-xs font-bold transition-all duration-300 sm:h-9 sm:w-9"
            :class="step > n || step === n
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-border bg-card text-muted-foreground'"
          >
            <Check v-if="step > n" :size="14" :stroke-width="3" />
            <template v-else>{{ n }}</template>
          </span>
          <span class="hidden min-w-0 sm:block">
            <span class="block text-[11px] font-bold uppercase tracking-[0.1em] leading-tight" :class="step >= n ? 'text-foreground' : 'text-muted-foreground'">
              {{ t(`booking.steps.${n - 1}.label`) }}
            </span>
            <span class="hidden text-[10px] leading-tight text-muted-foreground xl:block">
              {{ t(`booking.steps.${n - 1}.detail`) }}
            </span>
          </span>
          <span v-if="n < 3" class="h-px flex-1 overflow-hidden rounded bg-border" aria-hidden="true">
            <span class="block h-full bg-accent transition-all duration-500" :style="{ width: step > n ? '100%' : '0%' }" />
          </span>
        </li>
      </ol>
    </div>

    <!-- Content -->
    <section class="container-shell grid gap-8 pt-8 lg:grid-cols-[1fr_380px]">
      <!-- Left: steps -->
      <div class="min-w-0">
        <p v-if="formError" role="alert" class="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-500">
          {{ formError }}
        </p>

        <Transition name="step-panel" mode="out-in">
          <!-- STEP 1 -->
          <div v-if="step === 1" key="step-1">
            <h2 class="font-display text-xl font-semibold tracking-[-0.03em]">{{ t('booking.room.selectRoom') }}</h2>

            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <button
                v-for="room in rooms"
                :key="room.id"
                type="button"
                class="group relative overflow-hidden rounded-2xl border text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                :class="selectedRoomId === room.id
                  ? 'border-accent shadow-[0_0_0_2px_hsl(var(--accent))]'
                  : 'border-border/80 hover:border-accent/50'"
                :aria-pressed="selectedRoomId === room.id"
                @click="selectedRoomId = room.id"
              >
                <img
                  :src="room.image"
                  :alt="roomName(room.id)"
                  class="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div class="p-4">
                  <div class="flex items-center justify-between gap-2">
                    <p class="font-display text-base font-semibold tracking-[-0.03em]">{{ roomName(room.id) }}</p>
                    <span
                      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition"
                      :class="selectedRoomId === room.id ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-transparent'"
                    >
                      <Check :size="13" :stroke-width="3.5" />
                    </span>
                  </div>
                  <p class="mt-1 text-sm font-bold text-accent">
                    {{ money(priceBreakdown(room.id, checkIn, checkOut).ratePerNight) }}
                    <span class="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{{ t('booking.room.perNight') }}</span>
                  </p>
                </div>
              </button>
            </div>

            <h2 class="mt-8 font-display text-xl font-semibold tracking-[-0.03em]">{{ t('booking.dates.heading') }}</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-border/80 bg-card p-4">
                <AppDatePicker
                  v-model="checkIn"
                  :label="t('booking.dates.checkIn')"
                  :min="isoDate(new Date())"
                  :aria-label="t('booking.dates.checkIn')"
                />
              </div>
              <div class="rounded-2xl border border-border/80 bg-card p-4">
                <AppDatePicker
                  v-model="checkOut"
                  :label="t('booking.dates.checkOut')"
                  :min="minCheckOut"
                  :aria-label="t('booking.dates.checkOut')"
                />
              </div>
            </div>

            <!-- Guests steppers -->
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <div v-for="kind in (['adults', 'children'] as const)" :key="kind" class="rounded-2xl border border-border/80 bg-card p-4">
                <span class="flex items-center gap-2 text-caption font-bold uppercase text-muted-foreground">
                  <Users :size="13" class="text-accent" />
                  {{ kind === 'adults' ? t('booking.dates.adults') : t('booking.dates.children') }}
                </span>
                <div class="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    class="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-accent hover:text-accent disabled:opacity-30"
                    :disabled="kind === 'adults' ? adults <= 1 : children <= 0"
                    :aria-label="'−'"
                    @click="kind === 'adults' ? adults-- : children--"
                  >
                    <Minus :size="14" />
                  </button>
                  <span class="font-display text-xl font-semibold">{{ kind === 'adults' ? adults : children }}</span>
                  <button
                    type="button"
                    class="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-accent hover:text-accent disabled:opacity-30"
                    :disabled="kind === 'adults' ? adults >= 4 : children >= 3"
                    :aria-label="'+'"
                    @click="kind === 'adults' ? adults++ : children++"
                  >
                    <Plus :size="14" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="group mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-sm font-bold uppercase tracking-[0.12em] text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
              @click="goTo(2)"
            >
              {{ t('common.actions.bookNow') }}
              <ChevronRight :size="16" class="icon-flip transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          <!-- STEP 2 -->
          <div v-else-if="step === 2" key="step-2">
            <h2 class="font-display text-xl font-semibold tracking-[-0.03em]">{{ t('booking.details.heading') }}</h2>
            <p class="mt-1.5 text-sm text-muted-foreground">{{ t('booking.details.subline') }}</p>

            <form v-if="step === 2" class="mt-5 grid gap-4" @submit.prevent="goTo(3)">
              <div>
                <label for="guest-name" class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.details.fullName') }}</label>
                <input id="guest-name" v-model="guestName" type="text" autocomplete="name" :placeholder="t('booking.details.fullNamePlaceholder')" class="app-field mt-1.5" />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label for="guest-email" class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.details.email') }}</label>
                  <input id="guest-email" v-model="email" type="email" autocomplete="email" :placeholder="t('booking.details.emailPlaceholder')" class="app-field mt-1.5" dir="ltr" />
                </div>
                <div>
                  <label for="guest-phone" class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.details.phone') }}</label>
                  <input id="guest-phone" v-model="phone" type="tel" autocomplete="tel" :placeholder="t('booking.details.phonePlaceholder')" class="app-field mt-1.5" dir="ltr" />
                </div>
              </div>
              <p v-if="isAuthenticated" class="flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/5 px-4 py-2.5 text-[11px] font-semibold text-accent">
                <Check :size="13" :stroke-width="3" /> {{ t('booking.details.sameAsProfile') }}
              </p>
              <div>
                <label for="arrival-time" class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.details.arrivalTime') }}</label>
                <AppSelect
                  id="arrival-time"
                  v-model="arrivalTime"
                  :options="arrivalTimes"
                  :aria-label="t('booking.details.arrivalTime')"
                  class="mt-1.5"
                />
              </div>
              <div>
                <label for="requests" class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.details.requests') }}</label>
                <textarea id="requests" v-model="requests" rows="3" :placeholder="t('booking.details.requestsPlaceholder')" class="booking-input mt-1.5 resize-none" />
              </div>
              <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button type="button" class="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground" @click="step = 1">
                  <ArrowLeft :size="14" class="icon-flip" /> {{ t('common.actions.back') }}
                </button>
                <button type="submit" class="group inline-flex h-14 items-center gap-2 rounded-2xl bg-accent px-8 text-sm font-bold uppercase tracking-[0.12em] text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float">
                  {{ t('common.actions.send') }}
                  <ArrowRight :size="15" class="icon-flip transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>

          <!-- STEP 3 -->
          <div v-else key="step-3">
            <h2 class="font-display text-xl font-semibold tracking-[-0.03em]">{{ t('booking.review.heading') }}</h2>
            <p class="mt-1.5 text-sm text-muted-foreground">{{ t('booking.review.subline') }}</p>

            <div class="mt-5 space-y-4">
              <!-- Room recap -->
              <div class="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4">
                <img :src="rooms.find(r => r.id === selectedRoomId)?.image" :alt="roomName(selectedRoomId)" class="h-24 w-28 shrink-0 rounded-xl object-cover" />
                <div class="min-w-0 flex-1">
                  <p class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.review.yourRoom') }}</p>
                  <p class="mt-0.5 font-display text-base font-semibold">{{ roomName(selectedRoomId) }}</p>
                  <p class="mt-1 text-[11px] font-semibold text-muted-foreground">
                    {{ checkIn }} → {{ checkOut }} · {{ breakdown.nights }} {{ breakdown.nights === 1 ? t('booking.dates.night') : t('booking.dates.nights') }} · {{ t('dashboard.bookings.card.guests', { count: totalGuests }) }}
                  </p>
                </div>
                <button type="button" class="shrink-0 text-xs font-bold text-accent transition hover:text-accent/80" @click="step = 1">{{ t('booking.review.editRoom') }}</button>
              </div>

              <!-- Guest recap -->
              <div class="flex items-start justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4">
                <div class="min-w-0">
                  <p class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.review.guestDetails') }}</p>
                  <p class="mt-0.5 font-display text-base font-semibold">{{ guestName }}</p>
                  <p class="mt-0.5 text-xs text-muted-foreground" dir="ltr">{{ email }}</p>
                  <p class="mt-0.5 text-xs text-muted-foreground" dir="ltr">{{ phone }} · {{ arrivalTime }}</p>
                </div>
                <button type="button" class="shrink-0 text-xs font-bold text-accent transition hover:text-accent/80" @click="step = 2">{{ t('booking.review.editDetails') }}</button>
              </div>

              <!-- Terms -->
              <label class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition" :class="termsError ? 'border-rose-500/50 bg-rose-500/5' : 'border-border/80 hover:border-accent/50'">
                <input v-model="termsAccepted" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 accent-accent" />
                <span class="text-sm leading-6 text-foreground/85">
                  {{ t('booking.review.terms') }}
                  <RouterLink to="/terms-and-conditions" class="link-underline font-bold text-accent" @click.stop>{{ t('booking.review.termsLink') }}</RouterLink>
                </span>
              </label>
              <p v-if="termsError" role="alert" class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-500">{{ termsError }}</p>

              <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button type="button" class="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground" @click="step = 2">
                  <ArrowLeft :size="14" class="icon-flip" /> {{ t('common.actions.back') }}
                </button>
                <button
                  type="button"
                  :disabled="submitting"
                  class="group inline-flex h-15 items-center gap-2 rounded-2xl bg-accent px-10 py-5 text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float disabled:opacity-70"
                  @click="submit"
                >
                  {{ submitting ? t('booking.review.processing') : t('booking.review.confirmBooking') }}
                  <Check v-if="!submitting" :size="17" :stroke-width="3" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Right: summary -->
      <aside class="lg:sticky lg:top-28 lg:self-start">
        <div class="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
          <div class="flex items-center gap-3 border-b border-border/70 bg-secondary/40 p-4">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BedDouble :size="20" />
            </span>
            <div>
              <p class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.summary.heading') }}</p>
              <p class="font-display text-sm font-semibold">{{ roomName(selectedRoomId) }}</p>
            </div>
          </div>
          <div class="space-y-3 p-5 text-sm">
            <div class="flex items-center justify-between text-muted-foreground">
              <span>{{ t('booking.summary.ratePerNight', { rate: money(breakdown.ratePerNight), nights: breakdown.nights, nightsLabel: breakdown.nights === 1 ? t('booking.dates.night') : t('booking.dates.nights') }) }}</span>
              <span class="font-semibold text-foreground">{{ money(breakdown.subtotal) }}</span>
            </div>
            <div v-if="breakdown.discount > 0" class="flex items-center justify-between text-accent">
              <span class="flex items-center gap-1.5"><Tag :size="13" /> {{ t('booking.summary.discount') }}</span>
              <span class="font-semibold">−{{ money(breakdown.discount) }}</span>
            </div>
            <div class="flex items-center justify-between text-muted-foreground">
              <span>{{ t('booking.summary.vat') }}</span>
              <span class="font-semibold text-foreground">{{ money(breakdown.vat) }}</span>
            </div>

            <!-- Promo -->
            <div class="rounded-xl border border-border/70 bg-secondary/30 p-3">
              <label for="promo" class="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{{ t('booking.promo.label') }}</label>
              <div class="mt-1.5 flex gap-2">
                <input
                  id="promo"
                  v-model="promoInput"
                  type="text"
                  :placeholder="t('booking.promo.placeholder')"
                  class="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold uppercase outline-none transition focus:border-accent"
                  @keydown.enter.prevent="applyPromo"
                />
                <button v-if="!promoApplied" type="button" class="rounded-lg bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-primary-foreground" @click="applyPromo">
                  {{ t('booking.promo.apply') }}
                </button>
                <button v-else type="button" class="rounded-lg border border-border px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-accent" @click="removePromo">
                  ✕
                </button>
              </div>
              <p v-if="promoError" class="mt-1.5 text-[10px] font-semibold text-rose-500">{{ promoError }}</p>
              <p v-if="promoApplied" class="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-accent"><Check :size="11" :stroke-width="3" />{{ t('booking.promo.applied', { code: promoApplied, percent: promoPercent }) }}</p>
            </div>

            <div class="border-t border-border pt-3">
              <div class="flex items-end justify-between">
                <span class="text-caption font-bold uppercase text-muted-foreground">{{ t('booking.summary.total') }}</span>
                <span class="font-display text-2xl font-semibold tracking-[-0.04em]">{{ money(breakdown.total) }}</span>
              </div>
              <p class="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                <ShieldCheck :size="12" class="text-accent" /> {{ t('booking.summary.payAtHotel') }}
              </p>
              <p class="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                <Sparkles :size="12" class="text-accent" /> {{ t('booking.summary.freeCancellation') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Trust strip -->
        <div class="mt-4 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <span class="flex items-center gap-1.5"><ConciergeBell :size="13" class="text-accent" /> 24/7</span>
          <span class="flex items-center gap-1.5"><ShieldCheck :size="13" class="text-accent" /> 5.0 / 2000+</span>
          <span class="flex items-center gap-1.5"><BedDouble :size="13" class="text-accent" /> 71</span>
        </div>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.step-panel-enter-active,
.step-panel-leave-active {
  transition:
    opacity 260ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}
.step-panel-enter-from {
  opacity: 0;
  transform: translateX(28px);
}
.step-panel-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
[dir='rtl'] .step-panel-enter-from {
  transform: translateX(-28px);
}
[dir='rtl'] .step-panel-leave-to {
  transform: translateX(16px);
}

.h-15 {
  height: 3.75rem;
}

input[type='date'] {
  color-scheme: dark;
}
.light input[type='date'] {
  color-scheme: light;
}
@media (prefers-reduced-motion: reduce) {
  .step-panel-enter-active,
  .step-panel-leave-active {
    transition: none;
  }
}
</style>

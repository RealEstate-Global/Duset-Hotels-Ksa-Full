<script setup lang="ts">
import { ref } from 'vue'
import { CreditCard, Plus, ShieldCheck, Trash2, BadgeCheck } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useBookingStore } from '@/features/booking/booking.store'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const { t } = useI18n()
const { cards, addCard, removeCard, setDefaultCard } = useBookingStore()
const toast = useToast()

const form = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
})
const removeTarget = ref<string | null>(null)
const errors = ref<string[]>([])

const brandFromNumber = (digits: string): 'visa' | 'mastercard' =>
  digits.startsWith('4') ? 'visa' : 'mastercard'

const formatCardNumber = (raw: string) =>
  raw
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim()

const formatExpiry = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`
  return digits
}

const onNumberInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.value.number = formatCardNumber(input.value)
}
const onExpiryInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.value.expiry = formatExpiry(input.value)
}

const submitCard = () => {
  errors.value = []
  const digits = form.value.number.replace(/\s/g, '')
  const expiryDigits = form.value.expiry.replace(/\D/g, '')
  if (digits.length < 13) errors.value.push('number')
  if (form.value.name.trim().length < 3) errors.value.push('name')
  if (expiryDigits.length !== 4) errors.value.push('expiry')
  if (!/^\d{3,4}$/.test(form.value.cvv.replace(/\D/g, ''))) errors.value.push('cvv')
  if (errors.value.length) return

  addCard({
    brand: brandFromNumber(digits),
    last4: digits.slice(-4),
    expMonth: expiryDigits.slice(0, 2),
    expYear: expiryDigits.slice(2),
    nameOnCard: form.value.name.trim().toUpperCase(),
    isDefault: cards.value.length === 0,
  })
  form.value = { number: '', name: '', expiry: '', cvv: '' }
  toast.success(t('dashboard.payments.addedToast'))
}

const removeCardConfirmed = () => {
  if (removeTarget.value) {
    removeCard(removeTarget.value)
    toast.info(t('dashboard.payments.removedToast'))
  }
  removeTarget.value = null
}

const makeDefault = (id: string) => {
  setDefaultCard(id)
  toast.success(t('dashboard.payments.defaultUpdatedToast'))
}
</script>

<template>
  <div>
    <p class="eyebrow">{{ t('dashboard.sidebar.payments') }}</p>
    <h1 class="display-title mt-2 text-h3">{{ t('dashboard.payments.title') }}</h1>
    <p class="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">{{ t('dashboard.payments.subline') }}</p>

    <div class="mt-6 grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <!-- Saved cards -->
      <section>
        <h2 class="text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">{{ t('dashboard.payments.savedCards') }}</h2>
        <div class="mt-4 grid gap-4">
          <article
            v-for="card in cards"
            :key="card.id"
            class="group relative overflow-hidden rounded-2xl p-5 text-white shadow-card transition duration-300 hover:-translate-y-0.5"
            :class="card.brand === 'visa' ? 'bg-gradient-to-br from-[#1a1f71] via-[#232c8f] to-[#3b4ac9]' : 'bg-gradient-to-br from-[#262626] via-[#3a3a3a] to-[#575757]'"
          >
            <div class="flex items-start justify-between">
              <span class="font-display text-lg font-black italic tracking-wide">{{ card.brand === 'visa' ? 'VISA' : 'MASTERCARD' }}</span>
              <span v-if="card.isDefault" class="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em]">
                <BadgeCheck :size="11" /> {{ t('dashboard.payments.default') }}
              </span>
            </div>
            <p class="mt-7 font-mono text-lg tracking-[0.22em] text-white/95" dir="ltr">•••• •••• •••• {{ card.last4 }}</p>
            <div class="mt-4 flex items-end justify-between text-[10px] text-white/70">
              <div>
                <p class="text-[8px] uppercase tracking-[0.2em] text-white/50">{{ t('dashboard.payments.nameOnCard') }}</p>
                <p class="mt-0.5 text-[11px] font-bold tracking-[0.08em]" dir="ltr">{{ card.nameOnCard }}</p>
              </div>
              <p class="font-mono text-xs font-bold" dir="ltr">{{ card.expMonth }} / {{ card.expYear }}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
              <button
                v-if="!card.isDefault"
                class="rounded-full bg-white/12 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/85 transition hover:bg-white/20 hover:text-white"
                @click="makeDefault(card.id)"
              >
                {{ t('dashboard.payments.setDefault') }}
              </button>
              <button
                class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/70 transition hover:bg-rose-500/25 hover:text-white"
                @click="removeTarget = card.id"
              >
                <Trash2 :size="12" /> {{ t('dashboard.payments.remove') }}
              </button>
            </div>
          </article>
        </div>

        <p class="mt-4 flex items-center gap-2 text-[10px] font-semibold leading-4 text-muted-foreground">
          <ShieldCheck :size="13" class="shrink-0 text-accent" /> {{ t('dashboard.payments.secureNote') }}
        </p>
      </section>

      <!-- Add card -->
      <section class="h-fit rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
        <h2 class="flex items-center gap-2 font-display text-lg font-semibold tracking-[-0.03em]">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent"><Plus :size="19" /></span>
          {{ t('dashboard.payments.addNew') }}
        </h2>
        <form class="mt-5 grid gap-4" @submit.prevent="submitCard">
          <div>
            <label for="card-number" class="text-caption font-bold uppercase text-muted-foreground">{{ t('dashboard.payments.cardNumber') }}</label>
            <div class="relative mt-1.5">
              <CreditCard :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="card-number"
                :value="form.number"
                type="text"
                inputmode="numeric"
                autocomplete="cc-number"
                :placeholder="t('dashboard.payments.cardNumberPlaceholder')"
                class="payment-input ps-11"
                :class="{ 'payment-input-error': errors.includes('number') }"
                dir="ltr"
                @input="onNumberInput"
              />
            </div>
          </div>
          <div>
            <label for="card-name" class="text-caption font-bold uppercase text-muted-foreground">{{ t('dashboard.payments.nameOnCard') }}</label>
            <input
              id="card-name"
              v-model="form.name"
              type="text"
              autocomplete="cc-name"
              :placeholder="t('dashboard.payments.nameOnCardPlaceholder')"
              class="payment-input mt-1.5"
              :class="{ 'payment-input-error': errors.includes('name') }"
              dir="ltr"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="card-expiry" class="text-caption font-bold uppercase text-muted-foreground">{{ t('dashboard.payments.expiry') }}</label>
              <input
                id="card-expiry"
                :value="form.expiry"
                type="text"
                inputmode="numeric"
                autocomplete="cc-exp"
                placeholder="MM / YY"
                class="payment-input mt-1.5"
                :class="{ 'payment-input-error': errors.includes('expiry') }"
                dir="ltr"
                @input="onExpiryInput"
              />
            </div>
            <div>
              <label for="card-cvv" class="text-caption font-bold uppercase text-muted-foreground">{{ t('dashboard.payments.cvv') }}</label>
              <input
                id="card-cvv"
                v-model="form.cvv"
                type="text"
                inputmode="numeric"
                autocomplete="cc-csc"
                placeholder="123"
                maxlength="4"
                class="payment-input mt-1.5"
                :class="{ 'payment-input-error': errors.includes('cvv') }"
                dir="ltr"
              />
            </div>
          </div>
          <button
            type="submit"
            class="mt-1 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
          >
            <CreditCard :size="17" /> {{ t('dashboard.payments.addCard') }}
          </button>
        </form>
      </section>
    </div>

    <ConfirmModal
      :open="removeTarget !== null"
      :title="t('dashboard.payments.removeTitle')"
      :body="t('dashboard.payments.removeBody')"
      :confirm-label="t('dashboard.payments.removeLabel')"
      :cancel-label="t('dashboard.payments.removeKeep')"
      @confirm="removeCardConfirmed"
      @cancel="removeTarget = null"
    />
  </div>
</template>

<style scoped>
.payment-input {
  width: 100%;
  height: 48px;
  border-radius: 0.85rem;
  border: 1px solid hsl(var(--border) / 0.8);
  background: hsl(var(--background) / 0.6);
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  outline: none;
  transition:
    border-color 200ms,
    box-shadow 200ms,
    background 200ms;
}
.payment-input::placeholder {
  color: hsl(var(--muted-foreground) / 0.6);
  font-weight: 400;
}
.payment-input:focus {
  border-color: hsl(var(--accent) / 0.6);
  background: hsl(var(--background));
  box-shadow: 0 0 0 3px hsl(var(--accent) / 0.12);
}
.payment-input-error {
  border-color: hsl(0 70% 55% / 0.6) !important;
  box-shadow: 0 0 0 3px hsl(0 70% 55% / 0.12) !important;
}
.h-13 {
  height: 3.25rem;
}
</style>

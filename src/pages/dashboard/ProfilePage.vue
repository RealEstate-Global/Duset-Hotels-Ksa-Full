<script setup lang="ts">
import { computed, ref } from 'vue'
import { BadgeCheck, Moon, RotateCcw, Sun, UserRound, Languages } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/features/auth/useAuth'
import { useBookingStore } from '@/features/booking/booking.store'
import { useToast } from '@/composables/useToast'
import { setLocale, type SupportedLocale } from '@/i18n'
import { useTheme } from '@/composables/useTheme'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const { t, locale } = useI18n()
const { user, updateProfile, initials } = useAuth()
const { readPrefs, writePrefs, clearDemoData } = useBookingStore()
const { isDark, toggleTheme } = useTheme()
const toast = useToast()

const form = ref({
  name: user.value?.name ?? '',
  email: user.value?.email ?? '',
  phone: user.value?.phone ?? '',
})

const prefs = ref(readPrefs())
const resetOpen = ref(false)

const localeCode = computed(() => (locale.value === 'ar' ? 'ar-SA' : 'en-SA'))
const memberSince = computed(() => {
  if (!user.value?.memberSince) return '—'
  return new Intl.DateTimeFormat(localeCode.value, { month: 'long', year: 'numeric' }).format(
    new Date(user.value.memberSince),
  )
})

const toggleLanguage = () => {
  const next: SupportedLocale = locale.value === 'en' ? 'ar' : 'en'
  setLocale(next)
}

const save = () => {
  updateProfile({
    name: form.value.name.trim(),
    email: form.value.email.trim().toLowerCase(),
    phone: form.value.phone.trim(),
  })
  toast.success(t('dashboard.profile.savedToast'))
}

const savePrefs = (patch: Partial<{ emailOffers: boolean; smsReminders: boolean }>) => {
  prefs.value = { ...prefs.value, ...patch }
  writePrefs(prefs.value)
}

const resetData = () => {
  clearDemoData()
  resetOpen.value = false
  toast.success(t('dashboard.profile.clearedToast'))
}
</script>

<template>
  <div>
    <p class="eyebrow">{{ t('dashboard.sidebar.profile') }}</p>
    <h1 class="display-title mt-2 text-h3">{{ t('dashboard.profile.title') }}</h1>
    <p class="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">{{ t('dashboard.profile.subline') }}</p>

    <div class="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
      <!-- Personal information -->
      <section class="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
        <div class="flex items-center gap-4 border-b border-border/70 pb-5">
          <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent font-display text-xl font-black text-accent-foreground">
            {{ initials }}
          </span>
          <div>
            <p class="font-display text-lg font-semibold tracking-[-0.03em]">{{ user?.name }}</p>
            <p class="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <BadgeCheck :size="12" class="text-accent" /> {{ t('dashboard.profile.memberSince') }} {{ memberSince }}
            </p>
          </div>
        </div>
        <h2 class="mt-5 flex items-center gap-2 text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <UserRound :size="14" class="text-accent" /> {{ t('dashboard.profile.personalInfo') }}
        </h2>
        <form class="mt-4 grid gap-4" @submit.prevent="save">
          <div>
            <label for="profile-name" class="text-caption font-bold uppercase text-muted-foreground">{{ t('dashboard.profile.name') }}</label>
            <input id="profile-name" v-model="form.name" type="text" autocomplete="name" class="profile-input mt-1.5" />
          </div>
          <div>
            <label for="profile-email" class="text-caption font-bold uppercase text-muted-foreground">{{ t('dashboard.profile.email') }}</label>
            <input id="profile-email" v-model="form.email" type="email" autocomplete="email" class="profile-input mt-1.5" dir="ltr" />
          </div>
          <div>
            <label for="profile-phone" class="text-caption font-bold uppercase text-muted-foreground">{{ t('dashboard.profile.phone') }}</label>
            <input id="profile-phone" v-model="form.phone" type="tel" autocomplete="tel" class="profile-input mt-1.5" dir="ltr" />
          </div>
          <button type="submit" class="mt-1 inline-flex h-13 w-fit items-center rounded-2xl bg-primary px-7 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition hover:-translate-y-0.5">
            {{ t('dashboard.profile.save') }}
          </button>
        </form>
      </section>

      <div class="space-y-6">
        <!-- Preferences -->
        <section class="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <h2 class="text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">{{ t('dashboard.profile.preferences') }}</h2>
          <div class="mt-4 divide-y divide-border/70">
            <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span class="block text-sm font-bold">{{ t('dashboard.profile.emailOffers') }}</span>
                <span class="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{{ t('dashboard.profile.emailOffersSub') }}</span>
              </span>
              <input type="checkbox" class="toggle" :checked="prefs.emailOffers" @change="savePrefs({ emailOffers: ($event.target as HTMLInputElement).checked })" />
            </label>
            <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span class="block text-sm font-bold">{{ t('dashboard.profile.smsReminders') }}</span>
                <span class="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{{ t('dashboard.profile.smsRemindersSub') }}</span>
              </span>
              <input type="checkbox" class="toggle" :checked="prefs.smsReminders" @change="savePrefs({ smsReminders: ($event.target as HTMLInputElement).checked })" />
            </label>
          </div>
        </section>

        <!-- Appearance + language -->
        <section class="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <h2 class="text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">{{ t('dashboard.profile.appearance') }}</h2>
          <div class="mt-4 flex flex-wrap gap-3">
            <button class="flex h-12 items-center gap-2 rounded-2xl border border-border px-5 text-xs font-bold text-foreground/80 transition hover:border-accent/60 hover:text-accent" @click="toggleTheme">
              <Sun v-if="isDark" :size="16" /><Moon v-else :size="16" />
              {{ isDark ? t('nav.switchToLight') : t('nav.switchToDark') }}
            </button>
            <button class="flex h-12 items-center gap-2 rounded-2xl border border-border px-5 text-xs font-bold text-foreground/80 transition hover:border-accent/60 hover:text-accent" @click="toggleLanguage">
              <Languages :size="16" />
              {{ locale === 'en' ? 'التبديل إلى العربية' : 'Switch to English' }}
            </button>
          </div>
        </section>

        <!-- Danger zone -->
        <section class="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5 sm:p-6">
          <h2 class="text-caption font-bold uppercase tracking-[0.18em] text-rose-500/90">{{ t('dashboard.profile.dangerZone') }}</h2>
          <p class="mt-2 text-sm font-bold">{{ t('dashboard.profile.clearDemoData') }}</p>
          <p class="mt-1 text-[11px] leading-4 text-muted-foreground">{{ t('dashboard.profile.clearDemoDataSub') }}</p>
          <button class="mt-4 flex h-12 items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 text-xs font-bold uppercase tracking-[0.12em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-500/20" @click="resetOpen = true">
            <RotateCcw :size="16" /> {{ t('dashboard.profile.clearDemoData') }}
          </button>
        </section>
      </div>
    </div>

    <ConfirmModal
      :open="resetOpen"
      :title="t('dashboard.profile.clearConfirmTitle')"
      :body="t('dashboard.profile.clearConfirmBody')"
      :confirm-label="t('dashboard.profile.clearConfirmLabel')"
      :cancel-label="t('dashboard.profile.clearKeep')"
      @confirm="resetData"
      @cancel="resetOpen = false"
    />
  </div>
</template>

<style scoped>
.profile-input {
  width: 100%;
  height: 48px;
  border-radius: 0.85rem;
  border: 1px solid hsl(var(--border) / 0.8);
  background: hsl(var(--background) / 0.6);
  padding: 0 1rem;
  font-size: 0.875rem;
  color: hsl(var(--foreground));
  outline: none;
  transition:
    border-color 200ms,
    box-shadow 200ms,
    background 200ms;
}
.profile-input:focus {
  border-color: hsl(var(--accent) / 0.6);
  background: hsl(var(--background));
  box-shadow: 0 0 0 3px hsl(var(--accent) / 0.12);
}

.h-13 {
  height: 3.25rem;
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  appearance: none;
  border-radius: 999px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--secondary));
  cursor: pointer;
  transition: background 220ms;
}
.toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  inset-inline-start: 2px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.toggle:checked {
  background: hsl(var(--accent));
  border-color: hsl(var(--accent));
}
.toggle:checked::after {
  transform: translateX(20px);
}
[dir='rtl'] .toggle:checked::after {
  transform: translateX(-20px);
}
</style>

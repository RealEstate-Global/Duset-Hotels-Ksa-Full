<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Check, Eye, EyeOff, X, Zap } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { DEMO_CREDENTIALS, useAuth } from '@/features/auth/useAuth'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { t, tm } = useI18n()
const router = useRouter()
const { signIn, register, isAuthenticated } = useAuth()
const toast = useToast()
const perks = computed(() => tm('auth.modal.perks') as unknown as string[])

const mode = ref<'signin' | 'register'>('signin')
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const submitting = ref(false)
const switchKey = ref(0)

const nameInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)

const reset = () => {
  name.value = ''
  email.value = ''
  phone.value = ''
  password.value = ''
  error.value = ''
  showPassword.value = false
  submitting.value = false
}

const close = () => emit('close')

const fillDemo = () => {
  mode.value = 'signin'
  email.value = DEMO_CREDENTIALS.email
  password.value = DEMO_CREDENTIALS.password
  error.value = ''
}

const submit = () => {
  error.value = ''
  submitting.value = true
  const fail = (reason: string) => {
    error.value = t(`auth.modal.errors.${reason}`)
    submitting.value = false
  }

  if (mode.value === 'signin') {
    const result = signIn(email.value, password.value)
    if (!result.ok) return fail(result.reason)
    toast.success(t('auth.modal.welcomeBack', { name: email.value.split('@')[0] }))
  } else {
    const result = register(name.value, email.value, password.value, phone.value)
    if (!result.ok) return fail(result.reason)
    toast.success(t('auth.modal.accountCreated', { name: name.value.trim() }))
  }

  submitting.value = false
  emit('close')
  router.push({ name: 'dashboard-overview' })
}

const switchMode = (next: 'signin' | 'register') => {
  if (mode.value === next) return
  mode.value = next
  error.value = ''
  switchKey.value++
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      reset()
      window.addEventListener('keydown', onKeydown)
      window.requestAnimationFrame(() => {
        if (mode.value === 'register') nameInput.value?.focus()
        else emailInput.value?.focus()
      })
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

watch(isAuthenticated, (loggedIn) => {
  if (loggedIn) close()
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="auth-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="t('auth.modal.title')"
      >
        <div class="absolute inset-0 bg-black/65 backdrop-blur-md" @click="close" />

        <div
          class="relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border/60 bg-card shadow-2xl sm:max-h-[86vh] sm:w-[min(92vw,880px)] sm:flex-row sm:rounded-3xl"
        >
          <!-- Brand panel -->
          <div
            class="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-primary p-8 text-primary-foreground md:flex md:w-[340px] lg:w-[380px]"
          >
            <div
              class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-primary-foreground/10"
              aria-hidden="true"
            />
            <img
              src="/images/uploads/logos/3203_duset_hotel_suites_logo.webp"
              alt="Duset Hotel Suites"
              class="relative h-11 w-auto max-w-[140px] rounded-lg bg-white/95 p-1 object-contain sm:h-12 sm:max-w-[160px] sm:p-1.5"
            />
            <div class="relative">
              <h2 class="font-display text-3xl font-semibold leading-[1.15] tracking-[-0.05em]">
                {{ t('auth.modal.title') }}
              </h2>
              <p class="mt-3 text-sm leading-6 text-primary-foreground/65">
                {{ t('auth.modal.subtitle') }}
              </p>
              <ul class="mt-7 space-y-3 text-sm text-primary-foreground/80">
                <li v-for="line in perks" :key="line" class="flex items-center gap-2.5">
                  <span class="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check :size="12" :stroke-width="3" />
                  </span>
                  {{ line }}
                </li>
              </ul>
            </div>
            <p class="relative text-[11px] text-primary-foreground/40">
              {{ t('auth.modal.locationLine') }}
            </p>
          </div>

          <!-- Form panel -->
          <div class="relative flex min-h-0 flex-1 flex-col overflow-y-auto p-5 sm:p-7 lg:p-8">
            <button
              class="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              :aria-label="t('common.actions.close')"
              @click="close"
            >
              <X :size="18" />
            </button>

            <!-- Mobile brand row -->
            <div class="mb-5 flex items-center gap-3 md:hidden">
              <img
                src="/images/uploads/logos/3203_duset_hotel_suites_logo.webp"
                alt="Duset Hotel Suites"
                class="h-10 w-auto max-w-[120px] rounded-lg bg-white/95 p-1 object-contain"
              />
              <p class="font-display text-sm font-semibold leading-tight text-foreground/85">
                {{ t('auth.modal.title') }}
              </p>
            </div>

            <!-- Tabs -->
            <div
              class="relative grid grid-cols-2 rounded-full border border-border/80 bg-secondary/60 p-1"
              role="tablist"
            >
              <span
                class="tab-indicator"
                :class="mode === 'register' ? 'translate-x-full rtl:-translate-x-full' : ''"
                aria-hidden="true"
              />
              <button
                role="tab"
                :aria-selected="mode === 'signin'"
                class="tab-button"
                :class="mode === 'signin' ? 'text-primary-foreground' : 'text-foreground/60 hover:text-foreground'"
                @click="switchMode('signin')"
              >
                {{ t('auth.modal.signInTab') }}
              </button>
              <button
                role="tab"
                :aria-selected="mode === 'register'"
                class="tab-button"
                :class="mode === 'register' ? 'text-primary-foreground' : 'text-foreground/60 hover:text-foreground'"
                @click="switchMode('register')"
              >
                {{ t('auth.modal.registerTab') }}
              </button>
            </div>

            <!-- Form -->
            <Transition name="form-swap" mode="out-in">
              <form :key="switchKey" class="mt-5 flex flex-col gap-3.5" @submit.prevent="submit">
                <div v-if="mode === 'register'">
                  <label for="auth-name" class="text-caption font-bold uppercase text-muted-foreground">{{ t('auth.modal.nameLabel') }}</label>
                  <input
                    id="auth-name"
                    ref="nameInput"
                    v-model="name"
                    type="text"
                    autocomplete="name"
                    :placeholder="t('auth.modal.namePlaceholder')"
                    class="app-field mt-1.5"
                  />
                </div>
                <div>
                  <label for="auth-email" class="text-caption font-bold uppercase text-muted-foreground">{{ t('auth.modal.emailLabel') }}</label>
                  <input
                    id="auth-email"
                    ref="emailInput"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    :placeholder="t('auth.modal.emailPlaceholder')"
                    class="app-field mt-1.5"
                    dir="ltr"
                  />
                </div>
                <div v-if="mode === 'register'">
                  <label for="auth-phone" class="text-caption font-bold uppercase text-muted-foreground">{{ t('auth.modal.phoneLabel') }}</label>
                  <input
                    id="auth-phone"
                    v-model="phone"
                    type="tel"
                    autocomplete="tel"
                    :placeholder="t('auth.modal.phonePlaceholder')"
                    class="app-field mt-1.5"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label for="auth-password" class="text-caption font-bold uppercase text-muted-foreground">{{ t('auth.modal.passwordLabel') }}</label>
                  <div class="relative mt-1.5">
                    <input
                      id="auth-password"
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      :autocomplete="mode === 'signin' ? 'current-password' : 'new-password'"
                      :placeholder="t('auth.modal.passwordPlaceholder')"
                      class="app-field pe-12"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      class="absolute end-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                      :aria-label="showPassword ? t('auth.modal.hidePassword') : t('auth.modal.showPassword')"
                      @click="showPassword = !showPassword"
                    >
                      <EyeOff v-if="showPassword" :size="17" /><Eye v-else :size="17" />
                    </button>
                  </div>
                </div>

                <p v-if="error" role="alert" class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold leading-5 text-rose-500">
                  {{ error }}
                </p>

                <button
                  type="submit"
                  :disabled="submitting"
                  class="group relative mt-1 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-accent px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-accent-foreground transition duration-300 hover:shadow-float disabled:opacity-70"
                >
                  <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full" />
                  <span class="relative">{{ submitting ? '…' : mode === 'signin' ? t('auth.modal.signInButton') : t('auth.modal.registerButton') }}</span>
                </button>

                <button
                  type="button"
                  class="text-center text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                  @click="switchMode(mode === 'signin' ? 'register' : 'signin')"
                >
                  {{ mode === 'signin' ? t('auth.modal.switchToRegister') : t('auth.modal.switchToSignIn') }}
                </button>
              </form>
            </Transition>

            <!-- Demo access -->
            <button
              class="group mt-5 flex items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-accent/5 px-4 py-3 text-start transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10"
              :aria-label="t('auth.modal.demoButton')"
              @click="fillDemo"
            >
              <span>
                <span class="block text-caption font-bold uppercase text-accent">{{ t('auth.modal.demoTitle') }}</span>
                <span class="mt-0.5 block text-[11px] font-semibold text-muted-foreground" dir="ltr">{{ t('auth.modal.demoNote') }}</span>
              </span>
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition group-hover:scale-110">
                <Zap :size="16" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tab-indicator {
  position: absolute;
  inset-block: 4px;
  inset-inline-start: 4px;
  z-index: 0;
  width: calc(50% - 4px);
  border-radius: 9999px;
  background: hsl(var(--primary));
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
.tab-button {
  position: relative;
  z-index: 1;
  height: 44px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 220ms;
}

.auth-modal-enter-active,
.auth-modal-leave-active {
  transition: opacity 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.auth-modal-enter-active > div:last-child,
.auth-modal-leave-active > div:last-child {
  transition:
    opacity 340ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 340ms cubic-bezier(0.22, 1, 0.36, 1);
}
.auth-modal-enter-from,
.auth-modal-leave-to {
  opacity: 0;
}
.auth-modal-enter-from > div:last-child,
.auth-modal-leave-to > div:last-child {
  opacity: 0;
  transform: translateY(34px) scale(0.97);
}

.form-swap-enter-active,
.form-swap-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}
.form-swap-enter-from {
  opacity: 0;
  transform: translateX(18px);
}
.form-swap-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
[dir='rtl'] .form-swap-enter-from {
  transform: translateX(-18px);
}
[dir='rtl'] .form-swap-leave-to {
  transform: translateX(12px);
}

.h-13 {
  height: 3.25rem;
}

@media (prefers-reduced-motion: reduce) {
  .auth-modal-enter-active,
  .auth-modal-leave-active,
  .form-swap-enter-active,
  .form-swap-leave-active,
  .tab-indicator {
    transition: none;
  }
}
</style>

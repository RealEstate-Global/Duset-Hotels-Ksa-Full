<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, CalendarRange, ChevronDown, CreditCard, Languages, LayoutDashboard, LogOut, Menu, Moon, Phone, Sun, UserRound, X, Mail } from 'lucide-vue-next'
import { ROUTES } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'
import { setLocale, type SupportedLocale } from '@/i18n'
import { useAuth } from '@/features/auth/useAuth'
import { useToast } from '@/composables/useToast'
import AuthModal from '@/components/layout/AuthModal.vue'

const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const { t, locale } = useI18n()
const { isAuthenticated, user, initials, signOut } = useAuth()
const toast = useToast()
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isAuthOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const links = computed(() => [
  { label: t('nav.links.rooms'), to: ROUTES.rooms },
  { label: t('nav.links.amenities'), to: ROUTES.amenities },
  { label: t('nav.links.gallery'), to: ROUTES.gallery },
  { label: t('nav.links.attractions'), to: ROUTES.attractions },
  { label: t('nav.links.contact'), to: ROUTES.contact },
])

const drawerLinks = computed(() => [
  { label: t('nav.links.home'), to: ROUTES.home },
  { label: t('nav.links.about'), to: ROUTES.about },
  ...links.value,
  { label: t('nav.links.faq'), to: ROUTES.faq },
])

const languageLabel = computed(() => (locale.value === 'en' ? 'ع' : 'EN'))
const themeLabel = computed(() =>
  isDark.value ? t('nav.switchToLight') : t('nav.switchToDark'),
)

const isActive = (to: string) =>
  to === ROUTES.rooms ? route.path.startsWith(ROUTES.rooms) : route.path === to

const headerClass = computed(() =>
  isScrolled.value
    ? 'border-border/80 bg-background/90 shadow-sm backdrop-blur-xl'
    : 'border-transparent bg-background',
)

const openAuth = () => {
  isMenuOpen.value = false
  isAuthOpen.value = true
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!isUserMenuOpen.value) return
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu()
  }
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeUserMenu()
}

const handleSignOut = () => {
  closeUserMenu()
  closeMenu()
  signOut()
  toast.info(t('auth.dropdown.signOut'))
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 18
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleLanguage = () => {
  const next: SupportedLocale = locale.value === 'en' ? 'ar' : 'en'
  setLocale(next)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
  // The dashboard guard bounced an anonymous visitor here — open the sign-in modal.
  if (route.query.auth === 'required' || window.sessionStorage.getItem('duset-open-auth')) {
    window.sessionStorage.removeItem('duset-open-auth')
    isAuthOpen.value = true
    toast.info(t('auth.modal.subtitle'))
  }
})

watch(isAuthenticated, (loggedIn) => {
  if (loggedIn && route.query.auth === 'required') {
    router.replace({ path: route.path, query: {} })
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b transition-all duration-standard ease-premium"
    :class="headerClass"
  >
    <div class="hidden border-b border-border/60 bg-primary text-primary-foreground/80 md:block">
      <div class="container-shell flex h-9 items-center justify-between text-[11px] font-semibold">
        <a
          :href="`tel:${SITE.phones[0].href.replace('tel:', '')}`"
          class="flex items-center gap-2 transition hover:text-primary-foreground"
          :aria-label="t('nav.topBar.call')"
        >
          <Phone :size="11" /> {{ SITE.phones[0].display }}
        </a>
        <a
          :href="SITE.emailHref"
          class="flex items-center gap-2 transition hover:text-primary-foreground"
          :aria-label="t('nav.topBar.email')"
        >
          <Mail :size="11" /> {{ SITE.email }}
        </a>
      </div>
    </div>

    <div class="container-shell flex h-[68px] items-center justify-between gap-4">
      <RouterLink
        :to="ROUTES.home"
        class="flex shrink-0 items-center gap-3"
        :aria-label="t('nav.homeAria')"
      >
        <img
          src="/images/uploads/logos/3203_duset_hotel_suites_logo.webp"
          alt="Duset Hotel Suites"
          class="h-11 w-auto rounded-lg bg-white/95 p-1.5 shadow-sm sm:h-12"
        />
      </RouterLink>

      <nav class="hidden items-center gap-7 lg:flex" :aria-label="t('nav.primaryNav')">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="link-underline text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
          :class="{ 'text-foreground': isActive(link.to) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-2 lg:flex">
        <button
          class="flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border border-border px-2.5 text-xs font-black tracking-wide text-foreground/75 transition duration-standard ease-premium hover:border-accent/50 hover:text-accent"
          :aria-label="t('nav.switchLanguage')"
          @click="toggleLanguage"
        >
          <Languages :size="15" />
          <span>{{ languageLabel }}</span>
        </button>
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition duration-standard ease-premium hover:bg-secondary hover:text-foreground"
          :aria-label="themeLabel"
          @click="toggleTheme"
        >
          <Transition name="icon-swap" mode="out-in">
            <Sun v-if="isDark" :key="'sun'" :size="17" :stroke-width="1.8" />
            <Moon v-else :key="'moon'" :size="17" :stroke-width="1.8" />
          </Transition>
        </button>

        <!-- Auth: sign-in trigger or user avatar dropdown -->
        <div v-if="!isAuthenticated" class="flex items-center">
          <button
            class="group inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-semibold text-foreground/75 transition duration-standard ease-premium hover:border-accent/50 hover:text-accent"
            :aria-label="t('auth.modal.signInTab')"
            @click="openAuth"
          >
            <UserRound :size="17" />
            <span class="hidden xl:inline">{{ t('auth.modal.signInTab') }}</span>
          </button>
        </div>
        <div v-else ref="userMenuRef" class="relative">
          <button
            class="flex h-10 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-1.5 transition duration-standard ease-premium hover:border-accent/60 hover:bg-accent/15"
            :aria-expanded="isUserMenuOpen"
            :aria-label="t('auth.dropdown.dashboard')"
            @click="toggleUserMenu"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[11px] font-black text-accent-foreground">{{ initials }}</span>
            <ChevronDown :size="15" class="text-accent transition duration-300" :class="{ 'rotate-180': isUserMenuOpen }" />
          </button>
          <Transition name="user-menu">
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-border/80 bg-card p-2 shadow-card-hover backdrop-blur-xl rtl:right-auto rtl:left-0"
              role="menu"
            >
              <div class="border-b border-border/70 px-3 py-3">
                <p class="font-display text-sm font-semibold leading-tight">{{ user?.name }}</p>
                <p class="mt-0.5 truncate text-[11px] text-muted-foreground" dir="ltr">{{ user?.email }}</p>
              </div>
              <div class="py-1.5">
                <RouterLink to="/dashboard" class="user-menu-item" role="menuitem" @click="closeUserMenu">
                  <LayoutDashboard :size="17" class="text-accent" /> {{ t('auth.dropdown.dashboard') }}
                </RouterLink>
                <RouterLink to="/dashboard/bookings" class="user-menu-item" role="menuitem" @click="closeUserMenu">
                  <CalendarRange :size="17" class="text-accent" />
                  {{ t('auth.dropdown.myBookings') }}
                </RouterLink>
                <RouterLink to="/dashboard/payments" class="user-menu-item" role="menuitem" @click="closeUserMenu">
                  <CreditCard :size="17" class="text-accent" /> {{ t('auth.dropdown.payments') }}
                </RouterLink>
                <RouterLink to="/dashboard/profile" class="user-menu-item" role="menuitem" @click="closeUserMenu">
                  <UserRound :size="17" class="text-accent" /> {{ t('auth.dropdown.profile') }}
                </RouterLink>
              </div>
              <button
                class="user-menu-item w-full border-t border-border/70 pt-3 text-left text-rose-500 hover:bg-rose-500/8 hover:text-rose-600 rtl:text-right"
                role="menuitem"
                @click="handleSignOut"
              >
                <LogOut :size="17" /> {{ t('auth.dropdown.signOut') }}
              </button>
            </div>
          </Transition>
        </div>
        <RouterLink
          to="/booking"
          class="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition duration-300 ease-premium hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-float"
        >
          {{ t('common.actions.bookNow') }}
          <ArrowRight
            :size="15"
            class="icon-flip transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </RouterLink>
      </div>

      <div class="flex items-center gap-2 lg:hidden">
        <button
          v-if="!isAuthenticated"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-secondary transition duration-standard ease-premium hover:-translate-y-0.5 hover:bg-secondary/80"
          :aria-label="t('auth.modal.signInTab')"
          @click="openAuth"
        >
          <UserRound :size="19" />
        </button>
        <RouterLink
          v-else
          to="/dashboard"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-[12px] font-black text-accent-foreground transition duration-standard ease-premium hover:-translate-y-0.5"
          :aria-label="t('auth.dropdown.dashboard')"
        >
          {{ initials }}
        </RouterLink>
        <button
          class="flex h-11 w-11 items-center justify-center rounded-full bg-secondary transition duration-standard ease-premium hover:-translate-y-0.5 hover:bg-secondary/80"
          :aria-label="t('common.actions.openMenu')"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = true"
        >
          <Menu :size="20" />
        </button>
      </div>
    </div>

    <Transition name="drawer">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-50 bg-primary/25 backdrop-blur-sm lg:hidden"
        @click.self="closeMenu"
      >
        <div
          class="drawer-panel ml-auto flex h-full w-[min(86vw,390px)] flex-col overflow-y-auto bg-background p-6 shadow-2xl"
        >
          <div class="flex items-center justify-between">
            <RouterLink
              :to="ROUTES.home"
              class="flex items-center"
              :aria-label="t('nav.homeAria')"
              @click="closeMenu"
            >
              <img
                src="/images/uploads/logos/3203_duset_hotel_suites_logo.webp"
                alt="Duset Hotel Suites"
                class="h-11 w-auto rounded-lg bg-white/95 p-1.5"
              />
            </RouterLink>
            <button
              class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition duration-standard ease-premium hover:bg-secondary/80"
              :aria-label="t('common.actions.closeMenu')"
              @click="closeMenu"
            >
              <X :size="19" />
            </button>
          </div>
          <nav class="mt-12 flex flex-col gap-5" :aria-label="t('nav.mobileNav')">
            <RouterLink
              v-for="link in drawerLinks"
              :key="link.to"
              :to="link.to"
              class="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground/90 transition hover:text-accent"
              @click="closeMenu"
              >{{ link.label }}</RouterLink
            >
          </nav>
          <div class="mt-auto space-y-4 pt-10">
            <a
              :href="SITE.phones[0].href"
              class="flex items-center gap-3 text-sm font-semibold text-foreground/75"
            >
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Phone :size="16" />
              </span>
              {{ SITE.phones[0].display }}
            </a>
            <a
              :href="SITE.emailHref"
              class="flex items-center gap-3 text-sm font-semibold text-foreground/75"
            >
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Mail :size="16" />
              </span>
              {{ SITE.email }}
            </a>
            <div class="flex items-center gap-3">
              <button
                class="flex items-center gap-3 text-sm font-semibold text-foreground/70"
                :aria-label="themeLabel"
                @click="toggleTheme"
              >
                <span
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition duration-standard ease-premium"
                  ><Transition name="icon-swap" mode="out-in"
                    ><Sun v-if="isDark" :key="'mobile-sun'" :size="17" /><Moon
                      v-else
                      :key="'mobile-moon'"
                      :size="17" /></Transition
                ></span>
                {{ isDark ? t('nav.switchToLight') : t('nav.switchToDark') }}
              </button>
              <button
                class="flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-black tracking-wide text-foreground/80 transition hover:border-accent/50 hover:text-accent"
                :aria-label="t('nav.switchLanguage')"
                @click="toggleLanguage"
              >
                <Languages :size="15" /> {{ languageLabel }}
              </button>
            </div>
            <div class="flex items-center gap-3 border-t border-border/60 pt-4">
              <template v-if="isAuthenticated">
                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-black text-accent-foreground">{{ initials }}</span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-bold">{{ user?.name }}</p>
                  <button class="text-[11px] font-semibold text-muted-foreground transition hover:text-foreground" @click="handleSignOut">
                    {{ t('auth.dropdown.signOut') }}
                  </button>
                </div>
                <RouterLink to="/dashboard" class="flex h-10 shrink-0 items-center rounded-full bg-accent px-4 text-xs font-bold text-accent-foreground" @click="closeMenu">{{ t('auth.dropdown.dashboard') }}</RouterLink>
              </template>
              <button v-else class="flex w-full items-center justify-center gap-2 rounded-2xl border border-accent/35 bg-accent/10 px-5 py-3.5 text-sm font-bold text-accent transition hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground" @click="openAuth">
                <UserRound :size="17" /> {{ t('auth.modal.signInTab') }} / {{ t('auth.modal.registerTab') }}
              </button>
            </div>
            <RouterLink
              to="/booking"
              class="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 text-sm font-bold text-accent-foreground transition duration-standard ease-premium hover:-translate-y-0.5"
              @click="closeMenu"
            >
              {{ t('common.actions.bookNow') }} <ArrowRight :size="16" class="icon-flip" />
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>

    <AuthModal :open="isAuthOpen" @close="isAuthOpen = false" />
  </header>
</template>

<style scoped>
.user-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  border-radius: 0.85rem;
  padding: 0.65rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: hsl(var(--foreground) / 0.8);
  transition:
    background 180ms,
    color 180ms;
}
.user-menu-item:hover {
  background: hsl(var(--secondary));
  color: hsl(var(--foreground));
}

.user-menu-enter-active,
.user-menu-leave-active {
  transition:
    opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.user-menu-enter-from,
.user-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-20deg);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 250ms ease;
}
.drawer-enter-active > div,
.drawer-leave-active > div {
  transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div,
.drawer-leave-to > div {
  transform: translateX(100%);
}
[dir='rtl'] .drawer-panel {
  margin-left: 0;
  margin-right: auto;
}
[dir='rtl'] .drawer-enter-from .drawer-panel,
[dir='rtl'] .drawer-leave-to .drawer-panel {
  transform: translateX(-100%);
}
</style>

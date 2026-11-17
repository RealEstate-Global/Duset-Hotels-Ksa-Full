<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Bell,
  CheckCheck,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  Waves,
  X,
  CalendarCheck2,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { useAuth } from '@/features/auth/useAuth'
import { useBookingStore } from '@/features/booking/booking.store'
import { ROUTES } from '@/constants/routes'
import AppDropdown from '@/components/common/AppDropdown.vue'
import AppMenuItem from '@/components/common/AppMenuItem.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppIconButton from '@/components/common/AppIconButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppTooltip from '@/components/common/AppTooltip.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const { signOut, user } = useAuth()
const { upcomingBookings } = useBookingStore()

const drawerOpen = ref(false)

interface Notification {
  id: string
  icon: typeof CalendarCheck2
  title: string
  body: string
  unread: boolean
}

const readIds = ref<string[]>(readStoredReadIds())

function readStoredReadIds(): string[] {
  try {
    const raw = window.sessionStorage.getItem('duset-notifications-read')
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

const notifications = computed<Notification[]>(() => {
  const list: Notification[] = []
  const next = upcomingBookings()[0]
  if (next) {
    list.push({
      id: `booking-${next.id}`,
      icon: CalendarCheck2,
      title: t('dashboard.notifications.bookingConfirmedTitle'),
      body: t('dashboard.notifications.bookingConfirmedBody'),
      unread: !readIds.value.includes(`booking-${next.id}`),
    })
  }
  list.push({
    id: 'welcome-rewards',
    icon: Sparkles,
    title: t('dashboard.notifications.welcomeTitle'),
    body: t('dashboard.notifications.welcomeBody'),
    unread: !readIds.value.includes('welcome-rewards'),
  })
  list.push({
    id: 'pool-maintenance',
    icon: Waves,
    title: t('dashboard.notifications.poolTitle'),
    body: t('dashboard.notifications.poolBody'),
    unread: !readIds.value.includes('pool-maintenance'),
  })
  return list
})

const unreadCount = computed(() => notifications.value.filter((item) => item.unread).length)

const markAllRead = () => {
  readIds.value = notifications.value.map((item) => item.id)
  try {
    window.sessionStorage.setItem('duset-notifications-read', JSON.stringify(readIds.value))
  } catch {
    /* blocked */
  }
}

const handleSignOut = () => {
  signOut()
  toast.info(t('auth.dropdown.signOut'))
  router.push(ROUTES.home)
}

const closeAll = () => {
  drawerOpen.value = false
}

watch(
  () => route.fullPath,
  closeAll,
)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeAll()
}

if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const navItems = computed(() => [
  {
    label: t('dashboard.sidebar.overview'),
    to: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: t('dashboard.sidebar.myBookings'),
    to: '/dashboard/bookings',
    icon: CalendarCheck2,
    badge: upcomingBookings().length || undefined,
  },
  {
    label: t('dashboard.sidebar.payments'),
    to: '/dashboard/payments',
    icon: CreditCard,
  },
])

const isActive = (to: string, exact = false) =>
  exact ? route.path === to : route.path.startsWith(to)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <!-- Top bar -->
    <header class="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div class="container-shell flex h-16 items-center justify-between gap-3">
        <div class="flex items-center gap-2 sm:gap-4">
          <AppIconButton
            class="lg:hidden"
            :label="t('common.actions.openMenu')"
            variant="ghost"
            @click="drawerOpen = true"
          >
            <Menu :size="20" />
          </AppIconButton>
          <RouterLink to="/" class="flex items-center gap-2.5" :aria-label="t('nav.homeAria')">
            <img
              src="/images/uploads/logos/3203_duset_hotel_suites_logo.webp"
              alt="Duset Hotel Suites"
              class="h-9 w-auto rounded-lg bg-white/95 p-1"
            />
            <span class="hidden font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground md:inline">
              Duset<span class="text-accent"> · </span>Dashboard
            </span>
          </RouterLink>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-3">
          <RouterLink
            to="/"
            class="hidden h-10 items-center gap-2 rounded-full border border-border px-4 text-xs font-bold text-foreground/70 transition hover:border-accent/50 hover:text-accent sm:inline-flex"
          >
            <Home :size="15" /> {{ t('dashboard.sidebar.viewSite') }}
          </RouterLink>

          <!-- Notifications -->
          <AppTooltip :text="t('dashboard.notifications.title')">
            <AppDropdown align="end" width="xl" panel-role="region" :label="t('dashboard.notifications.title')" trigger-class="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground/70 transition hover:bg-secondary hover:text-foreground">
              <template #trigger>
                <Bell :size="19" />
                <AppBadge
                  v-if="unreadCount"
                  variant="accent"
                  class="absolute right-1.5 top-1.5 h-4 min-w-4 px-1 text-[8px]"
                  :count="unreadCount"
                />
              </template>
            <div class="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <p class="font-display text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {{ t('dashboard.notifications.title') }}
              </p>
              <button
                class="flex items-center gap-1.5 text-[11px] font-bold text-accent transition hover:text-accent/80"
                @click="markAllRead"
              >
                <CheckCheck :size="13" /> {{ t('dashboard.notifications.markAllRead') }}
              </button>
            </div>
            <ul class="max-h-80 divide-y divide-border/60 overflow-y-auto">
              <li v-for="notification in notifications" :key="notification.id" class="flex gap-3 px-4 py-3 transition hover:bg-secondary/40">
                <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <component :is="notification.icon" :size="17" />
                </span>
                <span class="min-w-0">
                  <span class="flex items-center gap-2 text-xs font-bold leading-5">
                    {{ notification.title }}
                    <span v-if="notification.unread" class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  </span>
                  <span class="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{{ notification.body }}</span>
                </span>
              </li>
            </ul>
          </AppDropdown>
          </AppTooltip>

          <!-- User menu -->
          <AppDropdown align="end" width="sm" :label="t('dashboard.sidebar.profile')" trigger-class="flex h-11 items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-1.5 transition hover:border-accent/60 hover:bg-accent/15">
            <template #trigger>
              <AppAvatar :name="user?.name ?? ''" size="sm" />
            </template>
            <template #default="{ close }">
              <div class="border-b border-border/70 px-3 py-2.5">
                <p class="truncate text-sm font-bold">{{ user?.name }}</p>
                <p class="truncate text-[11px] text-muted-foreground" dir="ltr">{{ user?.email }}</p>
              </div>
              <div class="py-1.5">
                <AppMenuItem to="/dashboard/profile" :icon="UserRound" @click="close">{{ t('dashboard.sidebar.profile') }}</AppMenuItem>
                <AppMenuItem danger :icon="LogOut" @click="close(); handleSignOut()">{{ t('dashboard.sidebar.signOut') }}</AppMenuItem>
              </div>
            </template>
          </AppDropdown>
        </div>
      </div>
    </header>

    <div class="flex min-h-0 flex-1">
      <!-- Sidebar (desktop) -->
      <aside
        class="sticky top-16 hidden h-[calc(100vh-4rem)] w-[272px] shrink-0 flex-col overflow-y-auto border-e border-border/60 bg-primary px-4 py-6 text-primary-foreground lg:flex"
      >
        <!-- User card -->
        <div class="flex items-center gap-3 rounded-2xl border border-primary-foreground/12 bg-primary-foreground/5 p-3.5">
          <AppAvatar :name="user?.name ?? ''" size="lg" />
          <div class="min-w-0">
            <p class="truncate text-sm font-bold">{{ user?.name }}</p>
            <p class="truncate text-[10px] uppercase tracking-[0.14em] text-primary-foreground/45">{{ t('dashboard.overview.stats.tierGold') }}</p>
          </div>
        </div>

        <nav class="mt-7 flex flex-col gap-1.5" :aria-label="t('dashboard.sidebar.main')">
          <p class="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-foreground/40">{{ t('dashboard.sidebar.main') }}</p>
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="dash-nav-item"
            :class="{ 'dash-nav-item-active': isActive(item.to, item.exact) }"
          >
            <component :is="item.icon" :size="18" class="shrink-0" />
            <span class="flex-1 truncate">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto"
            >
              <AppBadge variant="accent" :count="item.badge" />
            </span>
          </RouterLink>
        </nav>

        <nav class="mt-7 flex flex-col gap-1.5" :aria-label="t('dashboard.sidebar.account')">
          <p class="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-foreground/40">{{ t('dashboard.sidebar.account') }}</p>
          <RouterLink to="/dashboard/profile" class="dash-nav-item" :class="{ 'dash-nav-item-active': isActive('/dashboard/profile') }">
            <UserRound :size="18" class="shrink-0" />
            <span class="flex-1">{{ t('dashboard.sidebar.profile') }}</span>
          </RouterLink>
          <button class="dash-nav-item text-rose-300 hover:bg-rose-500/15 hover:text-rose-200" @click="handleSignOut">
            <LogOut :size="18" class="shrink-0" />
            <span class="flex-1">{{ t('dashboard.sidebar.signOut') }}</span>
          </button>
        </nav>

        <div class="mt-auto rounded-2xl border border-accent/25 bg-accent/10 p-4">
          <Sparkles :size="18" class="text-accent" />
          <p class="mt-2 text-xs font-bold leading-5 text-accent">{{ t('dashboard.notifications.welcomeTitle') }}</p>
          <p class="mt-1 text-[11px] leading-4 text-primary-foreground/60">{{ t('dashboard.notifications.welcomeBody') }}</p>
        </div>
      </aside>

      <!-- Content -->
      <main class="min-w-0 flex-1">
        <div class="container-shell py-6 sm:py-8">
          <RouterView />
        </div>
      </main>
    </div>

    <!-- Sidebar (mobile drawer) -->
    <Transition name="dash-drawer">
      <div v-if="drawerOpen" class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="drawerOpen = false" />
        <aside class="dash-drawer-panel absolute inset-y-0 start-0 flex w-[min(84vw,320px)] flex-col overflow-y-auto bg-primary px-5 py-6 text-primary-foreground">
          <div class="flex items-center justify-between">
            <p class="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground/60">{{ t('nav.mobileNav') }}</p>
            <button
              class="flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10 transition hover:bg-primary-foreground/15"
              :aria-label="t('common.actions.closeMenu')"
              @click="drawerOpen = false"
            >
              <X :size="20" />
            </button>
          </div>
          <div class="mt-6 flex items-center gap-3 rounded-2xl border border-primary-foreground/12 bg-primary-foreground/5 p-3.5">
            <AppAvatar :name="user?.name ?? ''" size="lg" />
            <div class="min-w-0">
              <p class="truncate text-sm font-bold">{{ user?.name }}</p>
              <p class="truncate text-[10px] uppercase tracking-[0.14em] text-primary-foreground/45">{{ t('dashboard.overview.stats.tierGold') }}</p>
            </div>
          </div>
          <nav class="mt-6 flex flex-col gap-1.5" :aria-label="t('dashboard.sidebar.main')">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="dash-nav-item"
              :class="{ 'dash-nav-item-active': isActive(item.to, item.exact) }"
            >
              <component :is="item.icon" :size="18" class="shrink-0" />
              <span class="flex-1">{{ item.label }}</span>
              <AppBadge v-if="item.badge" variant="accent" :count="item.badge" />
            </RouterLink>
            <RouterLink to="/dashboard/profile" class="dash-nav-item" :class="{ 'dash-nav-item-active': isActive('/dashboard/profile') }">
              <UserRound :size="18" class="shrink-0" />
              <span class="flex-1">{{ t('dashboard.sidebar.profile') }}</span>
            </RouterLink>
            <button class="dash-nav-item text-rose-300" @click="handleSignOut">
              <LogOut :size="18" class="shrink-0" />
              <span class="flex-1">{{ t('dashboard.sidebar.signOut') }}</span>
            </button>
          </nav>
          <RouterLink to="/" class="mt-auto flex items-center justify-center gap-2 rounded-2xl border border-primary-foreground/15 px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/75 transition hover:bg-primary-foreground/10">
            <Home :size="15" /> {{ t('dashboard.sidebar.viewSite') }}
          </RouterLink>
        </aside>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dash-nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  border-radius: 0.85rem;
  padding: 0.7rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: hsl(var(--primary-foreground) / 0.68);
  transition:
    background 180ms,
    color 180ms;
}
.dash-nav-item:hover {
  background: hsl(var(--primary-foreground) / 0.07);
  color: hsl(var(--primary-foreground));
}
.dash-nav-item-active {
  background: hsl(var(--accent) / 0.16);
  color: hsl(var(--accent));
}
.dash-nav-item-active::before {
  content: '';
  position: absolute;
  inset-block: 18%;
  inset-inline-start: -1px;
  width: 3px;
  border-radius: 999px;
  background: hsl(var(--accent));
}

.dash-drawer-enter-active,
.dash-drawer-leave-active {
  transition: opacity 250ms ease;
}
.dash-drawer-enter-active .dash-drawer-panel,
.dash-drawer-leave-active .dash-drawer-panel {
  transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
}
.dash-drawer-enter-from,
.dash-drawer-leave-to {
  opacity: 0;
}
.dash-drawer-enter-from .dash-drawer-panel,
.dash-drawer-leave-to .dash-drawer-panel {
  transform: translateX(-100%);
}
[dir='rtl'] .dash-drawer-enter-from .dash-drawer-panel,
[dir='rtl'] .dash-drawer-leave-to .dash-drawer-panel {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .dash-drawer-enter-active,
  .dash-drawer-leave-active {
    transition: none;
  }
}
</style>

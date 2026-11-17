import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/constants/routes'
import i18n from '@/i18n'
import { useAuth } from '@/features/auth/useAuth'
// Home is imported statically so first paint has content immediately (no empty layout).
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: ROUTES.home,
      name: 'home',
      component: HomePage,
      meta: { metaKey: 'home' },
    },
    {
      path: ROUTES.about,
      name: 'about',
      component: () => import('@/pages/AboutPage.vue'),
      meta: { metaKey: 'about' },
    },
    {
      path: ROUTES.rooms,
      name: 'rooms',
      component: () => import('@/pages/RoomsPage.vue'),
      meta: { metaKey: 'rooms' },
    },
    {
      path: '/rooms/:slug',
      name: 'room-detail',
      component: () => import('@/pages/RoomDetailPage.vue'),
      meta: { metaKey: 'roomDetail' },
    },
    {
      path: ROUTES.amenities,
      name: 'amenities',
      component: () => import('@/pages/AmenitiesPage.vue'),
      meta: { metaKey: 'amenities' },
    },
    {
      path: ROUTES.gallery,
      name: 'gallery',
      component: () => import('@/pages/GalleryPage.vue'),
      meta: { metaKey: 'gallery' },
    },
    {
      path: ROUTES.attractions,
      name: 'attractions',
      component: () => import('@/pages/AttractionsPage.vue'),
      meta: { metaKey: 'attractions' },
    },
    {
      path: ROUTES.contact,
      name: 'contact',
      component: () => import('@/pages/ContactPage.vue'),
      meta: { metaKey: 'contact' },
    },
    {
      path: ROUTES.faq,
      name: 'faq',
      component: () => import('@/pages/FaqPage.vue'),
      meta: { metaKey: 'faq' },
    },
    {
      path: ROUTES.privacyPolicy,
      name: 'privacy-policy',
      component: () => import('@/pages/PrivacyPolicyPage.vue'),
      meta: { metaKey: 'privacyPolicy' },
    },
    {
      path: ROUTES.refundPolicy,
      name: 'refund-policy',
      component: () => import('@/pages/RefundPolicyPage.vue'),
      meta: { metaKey: 'refundPolicy' },
    },
    {
      path: ROUTES.terms,
      name: 'terms-and-conditions',
      component: () => import('@/pages/TermsPage.vue'),
      meta: { metaKey: 'terms' },
    },
    {
      path: ROUTES.booking,
      name: 'booking',
      component: () => import('@/pages/booking/BookingPage.vue'),
      meta: { metaKey: 'booking' },
    },
    {
      path: `${ROUTES.booking}/confirmation/:ref`,
      name: 'booking-confirmation',
      component: () => import('@/pages/booking/BookingConfirmationPage.vue'),
      meta: { metaKey: 'confirmation' },
    },
    {
      path: '/dashboard',
      meta: { layout: 'dashboard', requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-overview',
          component: () => import('@/pages/dashboard/OverviewPage.vue'),
          meta: { metaKey: 'dashboardOverview' },
        },
        {
          path: 'bookings',
          name: 'dashboard-bookings',
          component: () => import('@/pages/dashboard/MyBookingsPage.vue'),
          meta: { metaKey: 'dashboardBookings' },
        },
        {
          path: 'bookings/:ref',
          name: 'dashboard-booking-detail',
          component: () => import('@/pages/dashboard/BookingDetailPage.vue'),
          meta: { metaKey: 'dashboardBookingDetail' },
        },
        {
          path: 'payments',
          name: 'dashboard-payments',
          component: () => import('@/pages/dashboard/PaymentsPage.vue'),
          meta: { metaKey: 'dashboardPayments' },
        },
        {
          path: 'profile',
          name: 'dashboard-profile',
          component: () => import('@/pages/dashboard/ProfilePage.vue'),
          meta: { metaKey: 'dashboardProfile' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { metaKey: 'notFound' },
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated.value) {
      if (typeof window !== 'undefined') window.sessionStorage.setItem('duset-open-auth', '1')
      return { path: '/', query: { auth: 'required' } }
    }
  }
  return true
})

router.afterEach((to) => {
  const key = String(to.meta.metaKey ?? 'home')
  document.title = i18n.global.t(`ui.meta.${key}.title`)
  const description = document.querySelector('meta[name="description"]')
  description?.setAttribute('content', i18n.global.t(`ui.meta.${key}.description`))
})

export default router

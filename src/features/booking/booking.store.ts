import { ref } from 'vue'
import { rateFor, nightsBetween, priceBreakdown, PROMO_CODES } from './data/pricing'
import type { Booking, PaymentCard } from './types'

const BOOKINGS_KEY = 'duset-bookings'
const PAYMENTS_KEY = 'duset-payments'
const PREFS_KEY = 'duset-prefs'

const read = <T>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

const write = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage blocked */
  }
}

const iso = (date: Date) => date.toISOString().slice(0, 10)
const daysFromNow = (days: number) => iso(new Date(Date.now() + days * 86_400_000))

const seedBookings = (): Booking[] => {
  const mk = (
    roomId: string,
    checkIn: string,
    nights: number,
    adults: number,
    children: number,
    offsetDays: number,
  ): Booking => {
    const checkOut = iso(new Date(new Date(checkIn).getTime() + nights * 86_400_000))
    const promo = null
    const price = priceBreakdown(roomId, checkIn, checkOut, promo ?? undefined)
    return {
      id: `DUS-DEMO-${String(offsetDays).padStart(4, '0')}`,
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      guestName: 'Demo Guest',
      email: 'demo@duset.com',
      phone: '00966500000000',
      arrivalTime: '14:00',
      requests: '',
      promo,
      nights: price.nights,
      ratePerNight: price.ratePerNight,
      subtotal: price.subtotal,
      discount: price.discount,
      vat: price.vat,
      total: price.total,
      status: 'confirmed',
      createdAt: Date.now() - offsetDays * 86_400_000,
    }
  }
  return [
    mk('deluxe-room', daysFromNow(21), 2, 2, 0, 300),
    mk('one-bed-room-apartment', daysFromNow(-62), 3, 2, 1, 512),
    mk('deluxe-two-bed-room', daysFromNow(-158), 4, 4, 2, 735),
  ]
}

const seedCards = (): PaymentCard[] => [
  {
    id: 'card-demo-1',
    brand: 'visa',
    last4: '4242',
    expMonth: '08',
    expYear: '28',
    nameOnCard: 'DEMO GUEST',
    isDefault: true,
  },
]

const bookings = ref<Booking[]>(read<Booking[]>(BOOKINGS_KEY) ?? seedBookings())
const cards = ref<PaymentCard[]>(read<PaymentCard[]>(PAYMENTS_KEY) ?? seedCards())

const persist = () => {
  write(BOOKINGS_KEY, bookings.value)
  write(PAYMENTS_KEY, cards.value)
}

const generateReference = () => {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, 'X')
  const stamp = Date.now().toString(36).slice(-4).toUpperCase()
  return `DUS-${stamp}${random}`
}

export const promoCodes = Object.keys(PROMO_CODES)

export const useBookingStore = () => {
  const createBooking = (input: {
    roomId: string
    checkIn: string
    checkOut: string
    adults: number
    children: number
    guestName: string
    email: string
    phone: string
    arrivalTime: string
    requests: string
    promo: string | null
  }): Booking => {
    const price = priceBreakdown(input.roomId, input.checkIn, input.checkOut, input.promo ?? '')
    const booking: Booking = {
      id: generateReference(),
      ...input,
      nights: price.nights,
      ratePerNight: price.ratePerNight,
      subtotal: price.subtotal,
      discount: price.discount,
      vat: price.vat,
      total: price.total,
      status: 'confirmed',
      createdAt: Date.now(),
    }
    bookings.value = [booking, ...bookings.value]
    persist()
    return booking
  }

  const cancelBooking = (id: string) => {
    bookings.value = bookings.value.map((booking) =>
      booking.id === id ? { ...booking, status: 'cancelled' as const } : booking,
    )
    persist()
  }

  const getBooking = (id: string) => bookings.value.find((booking) => booking.id === id)

  const upcomingBookings = () =>
    bookings.value
      .filter(
        (booking) =>
          booking.status === 'confirmed' && new Date(booking.checkOut).getTime() >= Date.now(),
      )
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn))

  const pastBookings = () =>
    bookings.value
      .filter((booking) => new Date(booking.checkOut).getTime() < Date.now())
      .sort((a, b) => b.checkOut.localeCompare(a.checkOut))

  const nightsBooked = () => bookings.value.filter((b) => b.status === 'confirmed').reduce((sum, b) => sum + b.nights, 0)

  const nearestUpcoming = () => upcomingBookings()[0] ?? null

  // Payments
  const addCard = (card: Omit<PaymentCard, 'id'>) => {
    const newCard: PaymentCard = { ...card, id: `card-${Date.now().toString(36)}` }
    const next = card.isDefault ? cards.value.map((c) => ({ ...c, isDefault: false })) : cards.value
    cards.value = [...next, newCard]
    persist()
    return newCard
  }

  const removeCard = (id: string) => {
    const remaining = cards.value.filter((card) => card.id !== id)
    if (remaining.length && !remaining.some((card) => card.isDefault)) {
      cards.value = remaining.map((card, index) => ({ ...card, isDefault: index === 0 }))
    } else {
      cards.value = remaining
    }
    persist()
  }

  const setDefaultCard = (id: string) => {
    cards.value = cards.value.map((card) => ({ ...card, isDefault: card.id === id }))
    persist()
  }

  // Preferences
  const readPrefs = () =>
    read<{ emailOffers: boolean; smsReminders: boolean }>(PREFS_KEY) ?? {
      emailOffers: true,
      smsReminders: false,
    }

  const writePrefs = (prefs: { emailOffers: boolean; smsReminders: boolean }) => write(PREFS_KEY, prefs)

  const clearDemoData = () => {
    bookings.value = seedBookings()
    cards.value = seedCards()
    persist()
  }

  return {
    bookings,
    cards,
    createBooking,
    cancelBooking,
    getBooking,
    upcomingBookings,
    pastBookings,
    nightsBooked,
    nearestUpcoming,
    addCard,
    removeCard,
    setDefaultCard,
    readPrefs,
    writePrefs,
    clearDemoData,
  }
}

export const defaultPricingFor = (roomId: string, checkIn: string, checkOut: string) => ({
  nights: nightsBetween(checkIn, checkOut),
  ratePerNight: rateFor(roomId),
})

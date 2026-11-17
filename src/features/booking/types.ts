export type BookingStatus = 'confirmed' | 'cancelled'

export interface Booking {
  id: string
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
  nights: number
  ratePerNight: number
  subtotal: number
  discount: number
  vat: number
  total: number
  status: BookingStatus
  createdAt: number
}

export interface AuthUser {
  name: string
  email: string
  phone: string
  memberSince: number
}

export interface PaymentCard {
  id: string
  brand: 'visa' | 'mastercard'
  last4: string
  expMonth: string
  expYear: string
  nameOnCard: string
  isDefault: boolean
}

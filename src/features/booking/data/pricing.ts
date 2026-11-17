export const CURRENCY = 'SAR'
export const VAT_RATE = 0.15 // Saudi VAT

export interface RoomPrice {
  roomId: string
  ratePerNight: number
}

/** Nightly rates in SAR. */
export const roomRates: RoomPrice[] = [
  { roomId: 'deluxe-room', ratePerNight: 395 },
  { roomId: 'one-bed-room-apartment', ratePerNight: 475 },
  { roomId: 'executive-two-bed-room', ratePerNight: 640 },
  { roomId: 'deluxe-two-bed-room', ratePerNight: 890 },
]

export const rateFor = (roomId: string) =>
  roomRates.find((rate) => rate.roomId === roomId)?.ratePerNight ?? 0

export const PROMO_CODES: Record<string, number> = {
  DUSET10: 0.1,
  DUSET15: 0.15,
}

export const promoDiscountRate = (code: string) =>
  PROMO_CODES[code.trim().toUpperCase()] ?? 0

export const nightsBetween = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(0, Math.round(ms / 86_400_000))
}

export const formatMoney = (amount: number, locale: string = 'en-SA') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: CURRENCY,
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  }).format(amount)

export interface PriceBreakdown {
  nights: number
  ratePerNight: number
  subtotal: number
  discount: number
  vat: number
  total: number
}

export const priceBreakdown = (
  roomId: string,
  checkIn: string,
  checkOut: string,
  promoCode?: string,
): PriceBreakdown => {
  const ratePerNight = rateFor(roomId)
  const nights = nightsBetween(checkIn, checkOut)
  const subtotal = ratePerNight * nights
  const discount = Math.round(subtotal * promoDiscountRate(promoCode ?? ''))
  const taxable = subtotal - discount
  const vat = Math.round(taxable * VAT_RATE)
  return { nights, ratePerNight, subtotal, discount, vat, total: taxable + vat }
}

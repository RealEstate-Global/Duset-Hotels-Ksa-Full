import { SITE } from '@/constants/site'
import type { Booking } from './types'

const pad = (n: number) => String(n).padStart(2, '0')

const formatDate = (iso: string, hour = 10, minute = 0) => {
  const d = new Date(`${iso}T00:00:00`)
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hour)}${pad(minute)}00`
}

/** Downloads an .ics calendar file for the booking. Works offline. */
export const downloadBookingIcs = (booking: Booking, roomName: string) => {
  const uid = `${booking.id}@dusethotelsuites`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Duset Hotel Suites//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(isoDateNow(), 0, 0)}`,
    `DTSTART:${formatDate(booking.checkIn, 10, 0)}`,
    `DTEND:${formatDate(booking.checkOut, 12, 0)}`,
    `SUMMARY:${escapeText(`Duset Hotel Suites — ${roomName} (${booking.id})`)}`,
    `LOCATION:${escapeText(SITE.address)}`,
    `DESCRIPTION:${escapeText(
      `Booking ${booking.id}. ${roomName}. Check-in 10:00 AM, check-out 12 Noon. Phone: ${SITE.phones[0].display}`,
    )}`,
    `ORGANIZER;CN=Duset Hotel Suites:mailto:${SITE.email}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${booking.id}.ics`
  anchor.click()
  URL.revokeObjectURL(url)
}

const escapeText = (text: string) => text.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')

const isoDateNow = () => new Date().toISOString().slice(0, 10)

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, BedDouble, CalendarDays, Users } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { rooms } from '@/features/rooms/data/rooms'
import { isoDate } from '@/features/booking/dates'

const { t, tm } = useI18n()
const router = useRouter()

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const dayAfter = new Date(tomorrow)
dayAfter.setDate(dayAfter.getDate() + 2)

const roomId = ref(rooms[0]?.id ?? '')
const checkIn = ref(isoDate(tomorrow))
const checkOut = ref(isoDate(dayAfter))
const guests = ref(2)

const roomName = (id: string) => {
  const entry = tm(`rooms.list.${id}`) as unknown as { name: string } | undefined
  return entry?.name ?? id
}

const minCheckOut = computed(() => {
  const d = new Date(`${checkIn.value}T00:00:00`)
  d.setDate(d.getDate() + 1)
  return isoDate(d)
})

const submit = () => {
  router.push({
    path: '/booking',
    query: { room: roomId.value, checkIn: checkIn.value, checkOut: checkOut.value, adults: String(guests.value) },
  })
}
</script>

<template>
  <form
    class="grid gap-2 rounded-2xl border border-white/15 bg-black/55 p-2 shadow-2xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_0.9fr_auto]"
    @submit.prevent="submit"
  >
    <label class="booking-control">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
        <BedDouble :size="17" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/55">{{ t('booking.room.selectRoom') }}</span>
        <select v-model="roomId" class="booking-select w-full" :aria-label="t('booking.room.selectRoom')">
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ roomName(room.id) }}
          </option>
        </select>
      </span>
    </label>

    <label class="booking-control">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
        <CalendarDays :size="17" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/55">{{ t('booking.dates.checkIn') }}</span>
        <input v-model="checkIn" type="date" :aria-label="t('booking.dates.checkIn')" class="booking-select w-full" :min="isoDate(new Date())" />
      </span>
    </label>

    <label class="booking-control">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
        <CalendarDays :size="17" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/55">{{ t('booking.dates.checkOut') }}</span>
        <input v-model="checkOut" type="date" :aria-label="t('booking.dates.checkOut')" class="booking-select w-full" :min="minCheckOut" />
      </span>
    </label>

    <label class="booking-control">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
        <Users :size="17" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/55">{{ t('booking.dates.adults') }}</span>
        <select v-model="guests" class="booking-select w-full" :aria-label="t('booking.dates.adults')">
          <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
        </select>
      </span>
    </label>

    <button
      type="submit"
      class="group flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-accent px-6 text-xs font-bold uppercase tracking-[0.14em] text-accent-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-float sm:col-span-2 lg:col-span-1"
    >
      {{ t('common.actions.bookNow') }}
      <ArrowRight :size="15" class="icon-flip transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  </form>
</template>

<style scoped>
.booking-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.85rem;
  border: 1px solid transparent;
  background: rgb(255 255 255 / 0.06);
  padding: 0.6rem 0.75rem;
  min-height: 56px;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.booking-control:hover,
.booking-control:focus-within {
  border-color: rgb(255 255 255 / 0.18);
  background: rgb(255 255 255 / 0.1);
}
.booking-select {
  background: transparent;
  border: 0;
  outline: none;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  min-width: 0;
  color-scheme: dark;
}
.booking-select option {
  color: #0f1a17;
  background: #fff;
}
</style>

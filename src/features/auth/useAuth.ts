import { computed, ref } from 'vue'
import type { AuthUser } from '@/features/booking/types'

const AUTH_KEY = 'duset-auth'

export const DEMO_CREDENTIALS = {
  email: 'demo@duset.com',
  password: 'demo123',
  name: 'Demo Guest',
} as const

interface AuthState {
  user: AuthUser
  signedInAt: number
}

const readAuth = (): AuthState | null => {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    return raw ? (JSON.parse(raw) as AuthState) : null
  } catch {
    return null
  }
}

const state = ref<AuthState | null>(typeof window !== 'undefined' ? readAuth() : null)

const persist = () => {
  try {
    if (state.value) window.localStorage.setItem(AUTH_KEY, JSON.stringify(state.value))
    else window.localStorage.removeItem(AUTH_KEY)
  } catch {
    /* storage blocked */
  }
}

const initialsFrom = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

export const useAuth = () => {
  const user = computed(() => state.value?.user ?? null)
  const isAuthenticated = computed(() => state.value !== null)
  const initials = computed(() => (user.value ? initialsFrom(user.value.name) : ''))

  const signIn = (email: string, password: string) => {
    const normalized = email.trim().toLowerCase()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) return { ok: false as const, reason: 'invalid-email' as const }
    if (password.length < 6) return { ok: false as const, reason: 'weak-password' as const }
    const isDemo =
      normalized === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
    const name = isDemo ? DEMO_CREDENTIALS.name : normalized.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    state.value = {
      user: {
        name,
        email: normalized,
        phone: '',
        memberSince: Date.now(),
      },
      signedInAt: Date.now(),
    }
    persist()
    return { ok: true as const }
  }

  const register = (name: string, email: string, password: string, phone = '') => {
    const normalized = email.trim().toLowerCase()
    if (!name.trim()) return { ok: false as const, reason: 'missing-name' as const }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) return { ok: false as const, reason: 'invalid-email' as const }
    if (password.length < 6) return { ok: false as const, reason: 'weak-password' as const }
    state.value = {
      user: {
        name: name.trim(),
        email: normalized,
        phone: phone.trim(),
        memberSince: Date.now(),
      },
      signedInAt: Date.now(),
    }
    persist()
    return { ok: true as const }
  }

  const updateProfile = (patch: Partial<Pick<AuthUser, 'name' | 'email' | 'phone'>>) => {
    if (!state.value) return
    state.value = { ...state.value, user: { ...state.value.user, ...patch } }
    persist()
  }

  const signOut = () => {
    state.value = null
    persist()
  }

  return {
    user,
    isAuthenticated,
    initials,
    signIn,
    register,
    updateProfile,
    signOut,
  }
}

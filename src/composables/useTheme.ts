import { computed, onMounted, ref } from 'vue'

const STORAGE_KEY = 'duset-theme'
// Match the pre-paint class set in index.html so the toggle icon is correct on first render.
const isDark = ref(
  typeof window !== 'undefined' && document.documentElement.classList.contains('dark'),
)

const preferredTheme = () => {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useTheme = () => {
  const themeLabel = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))

  const applyTheme = (dark: boolean) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }

  const toggleTheme = () => applyTheme(!isDark.value)

  onMounted(() => {
    applyTheme(preferredTheme())
  })

  return { isDark, themeLabel, toggleTheme }
}

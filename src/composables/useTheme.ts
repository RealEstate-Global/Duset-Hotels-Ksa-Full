import { computed, ref } from 'vue'

const STORAGE_KEY = 'duset-theme'
// Match the pre-paint class set in index.html so the toggle icon is correct on first render.
const isDark = ref(
  typeof window !== 'undefined' && document.documentElement.classList.contains('dark'),
)

export const useTheme = () => {
  const themeLabel = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))

  const applyTheme = (dark: boolean) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }

  const toggleTheme = () => applyTheme(!isDark.value)

  // isDark initializes from the pre-paint class set in index.html, so there is
  // nothing to re-apply on mount (avoids redundant localStorage writes and
  // class-list mutations on <html> during the critical path).

  return { isDark, themeLabel, toggleTheme }
}

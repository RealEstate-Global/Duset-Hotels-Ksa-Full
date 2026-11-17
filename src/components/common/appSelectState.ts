import { ref } from 'vue'

/**
 * Shared singleton — the id of the currently-open AppSelect (or null).
 * Used by AppSelect instances to coordinate "only one select open at a time".
 * Lives in its own module because <script setup> has no module-level state.
 */
export const openSelectId = ref<string | null>(null)

import { ref } from 'vue'

export type ToastKind = 'success' | 'info' | 'error'

export interface Toast {
  id: number
  kind: ToastKind
  title: string
  message?: string
}

const toasts = ref<Toast[]>([])
let nextId = 1

export const useToast = () => {
  const push = (toast: Omit<Toast, 'id'>) => {
    const id = nextId++
    toasts.value = [...toasts.value, { ...toast, id }]
    window.setTimeout(() => {
      toasts.value = toasts.value.filter((item) => item.id !== id)
    }, 4200)
  }

  const success = (title: string, message?: string) => push({ kind: 'success', title, message })
  const info = (title: string, message?: string) => push({ kind: 'info', title, message })
  const error = (title: string, message?: string) => push({ kind: 'error', title, message })

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  return { toasts, success, info, error, dismiss }
}

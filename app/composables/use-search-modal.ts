import { useState } from '#app'

export const useSearchModal = () => {
  const isOpen = useState<boolean>('search-modal', () => false)

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, toggle, open, close }
}

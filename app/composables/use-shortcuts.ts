export const useShortcuts = () => {
  const metaSymbol = ref('Ctrl')

  if (import.meta.client) {
    metaSymbol.value = navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'
  }

  return { metaSymbol }
}

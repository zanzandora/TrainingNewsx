export const useUIState = () => {
  // Open/close search modal
  const contentSearch = useState('contentSearch', () => false)

  const toggleContentSearch = () => {
    contentSearch.value = !contentSearch.value
  }

  return { contentSearch, toggleContentSearch }
}

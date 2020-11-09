const restoreFromLocalStorage = (name: string) => {
  const localStoredPages = localStorage.getItem(`@SouthSystem:${name}`)

  if (localStoredPages) {
    return JSON.parse(localStoredPages)
  }

  return undefined
}

const saveToLocalStorage = (name: string, obj: string): void => {
  if (!obj) {
    localStorage.removeItem(`@SouthSystem:${name}`)
    return
  }

  localStorage.setItem(`@SouthSystem:${name}`, obj)
}

export { saveToLocalStorage, restoreFromLocalStorage }

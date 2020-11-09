const restoreFromLocalStorage = (name: string): string | null => {
  return localStorage.getItem(`@SouthSystem:${name}`)
}

const saveToLocalStorage = (name: string, obj: string): void => {
  if (!obj) {
    localStorage.removeItem(`@SouthSystem:${name}`)
    return
  }

  localStorage.setItem(`@SouthSystem:${name}`, obj)
}

export { saveToLocalStorage, restoreFromLocalStorage }

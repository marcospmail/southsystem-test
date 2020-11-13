const calculatePages = (
  currentPage: number,
  totalItems: number,
  maxItemsPerPage: number
): number[] => {
  if (!currentPage || !totalItems) return []

  const PAGE_DIVIDER = 60
  const MAX_PAGES = 15

  const maxPages = Math.min(window.innerWidth / PAGE_DIVIDER, MAX_PAGES)

  const min = 1
  const total = Math.ceil(totalItems / maxItemsPerPage)
  let length = maxPages

  if (length > total) length = total

  let start = currentPage - Math.floor(length / 2)
  start = Math.max(start, min)
  start = Math.min(start, min + total - length)

  start = Math.floor(start)

  return Array.from({ length }, (el, i) => start + i)
}

export { calculatePages }

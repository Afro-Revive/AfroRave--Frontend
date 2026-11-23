import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const ADMIN_PAGE_SIZE = 20

/**
 * A list page's page number, search and one filter, kept in the address so a
 * refresh or a shared link shows the same rows. Typing waits a moment before
 * it searches, and any change goes back to page 1.
 */
export function useListParams<F extends string>(filterKey?: string) {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNumber = Math.max(1, Number(searchParams.get('page')) || 1)
  const searchQuery = searchParams.get('q') ?? ''
  const filter = (filterKey ? (searchParams.get(filterKey) ?? '') : '') as F | ''

  const update = useCallback(
    (changes: Record<string, string | number | undefined>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const [key, value] of Object.entries(changes)) {
            if (value === undefined || value === '' || (key === 'page' && value === 1)) next.delete(key)
            else next.set(key, String(value))
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  // What's in the box, ahead of the search it will run.
  const [searchText, setSearchText] = useState(searchQuery)
  const debounced = useDebouncedValue(searchText.trim())
  useEffect(() => {
    if (debounced !== searchQuery) update({ q: debounced, page: 1 })
  }, [debounced, searchQuery, update])

  return {
    pageNumber,
    pageSize: ADMIN_PAGE_SIZE,
    searchQuery,
    searchText,
    setSearchText,
    filter,
    setFilter: (value: F | '') => update(filterKey ? { [filterKey]: value, page: 1 } : {}),
    setPage: (page: number) => update({ page }),
  }
}

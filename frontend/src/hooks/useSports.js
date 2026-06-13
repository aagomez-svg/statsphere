import { useState, useEffect, useCallback } from 'react'

export function useSports(fetchFn, refreshInterval = 60000) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    try {
      setError(null)
      const result = await fetchFn()
      setData(result)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    load()
    const interval = setInterval(load, refreshInterval)
    return () => clearInterval(interval)
  }, [load, refreshInterval])

  return { data, loading, error, refetch: load, lastUpdated }
}

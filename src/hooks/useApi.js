// FILE: /src/hooks/useApi.js
// Custom hook for API calls with loading and error states

import { useState, useEffect, useCallback, useRef } from 'react'

export const useApi = (apiFunction, immediate = true, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const hasExecutedRef = useRef(false)
  const apiFunctionRef = useRef(apiFunction)

  // Update ref when apiFunction changes
  useEffect(() => {
    apiFunctionRef.current = apiFunction
  }, [apiFunction])

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunctionRef.current(...args)
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err.message || err.data?.message || 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Only execute if immediate is true and we haven't executed yet for these dependencies
    if (immediate) {
      // Reset hasExecutedRef when dependencies change
      hasExecutedRef.current = false
    }
  }, [dependencies])

  useEffect(() => {
    if (immediate && !hasExecutedRef.current) {
      hasExecutedRef.current = true
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...dependencies])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
    hasExecutedRef.current = false
  }, [])

  return { data, loading, error, execute, reset }
}



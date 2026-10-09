import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

/** Fetches `path` whenever it changes. Pass null to skip the request. */
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: null, loading: Boolean(path) })

  useEffect(() => {
    if (!path) {
      setState({ data: null, error: null, loading: false })
      return
    }
    let cancelled = false
    setState((prev) => ({ ...prev, error: null, loading: true }))
    api(path)
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }))
    return () => {
      cancelled = true
    }
  }, [path])

  return state
}

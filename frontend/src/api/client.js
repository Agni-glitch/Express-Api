const BASE_URL = '/api/v1'
const STORAGE_KEY = 'cineflix_auth'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export const loadSession = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

export const saveSession = (session) => {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  else localStorage.removeItem(STORAGE_KEY)
}

let onUnauthorized = null
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

/**
 * Calls the API and returns the parsed JSON body (null for 204).
 * `keepSession` stops a 401 from logging the user out, for endpoints that
 * use 401 for something other than an invalid token (e.g. a wrong current password).
 */
export async function api(path, { method = 'GET', body, keepSession = false } = {}) {
  const token = loadSession()?.token
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Is the API running?', 0)
  }

  if (res.status === 204) return null

  const text = await res.text()
  let data = null
  try {
    data = JSON.parse(text)
  } catch {
    // non-JSON body, e.g. the rate limiter's plain-text message
  }

  if (!res.ok) {
    if (res.status === 401 && token && !keepSession) onUnauthorized?.()
    const fallback =
      res.status >= 500 && !text
        ? 'Cannot reach the API server. Is it running?'
        : text && !data
          ? text
          : `Request failed (${res.status})`
    throw new ApiError(data?.message || fallback, res.status)
  }
  return data
}

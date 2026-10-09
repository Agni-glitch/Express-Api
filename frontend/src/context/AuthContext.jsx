import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, loadSession, saveSession, setUnauthorizedHandler } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(loadSession)

  const setSession = useCallback((token, user) => {
    const next = token ? { token, user } : null
    saveSession(next)
    setSessionState(next)
  }, [])

  const logout = useCallback(() => setSession(null), [setSession])

  // an expired or revoked token ends the session
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const value = useMemo(() => {
    const authenticate = async (path, body) => {
      const res = await api(path, { method: 'POST', body, keepSession: true })
      setSession(res.token, res.data.user)
      return res.data.user
    }
    return {
      user: session?.user || null,
      isAdmin: session?.user?.role === 'admin',
      login: (email, password) => authenticate('/auth/login', { email, password }),
      signup: (fields) => authenticate('/auth/signup', fields),
      logout,
      setSession,
      updateUser: (user) => setSession(session?.token, user),
    }
  }, [session, logout, setSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

/**
 * Logs out and goes to the home page. The logout runs as a transition so it
 * renders together with the navigation; otherwise a protected page would see
 * the missing user first and redirect to /login.
 */
export function useSignOut() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return useCallback(() => {
    navigate('/', { replace: true })
    startTransition(logout)
  }, [logout, navigate])
}

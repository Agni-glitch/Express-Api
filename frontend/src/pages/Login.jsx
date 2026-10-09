import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Alert, Button, Card, Field } from '../components/ui.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/movies'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={from} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {location.state?.from ? 'Log in to continue.' : 'Welcome back.'}
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Alert>{error}</Alert>
          <Button type="submit" className="w-full" loading={loading}>
            Log in
          </Button>
        </form>
        <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm text-zinc-400">
          <Link to="/forgot-password" className="hover:text-amber-300">
            Forgot password?
          </Link>
          <span>
            New here?{' '}
            <Link to="/signup" state={location.state} className="text-amber-400 hover:underline">
              Create an account
            </Link>
          </span>
        </div>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Alert, Button, Card, Field } from '../components/ui.jsx'

export default function Signup() {
  const { user, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/movies'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={from} replace />

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError("Password and confirm password don't match.")
    setLoading(true)
    try {
      await signup(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="mt-1 text-sm text-zinc-400">Sign up to browse the full catalogue.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Name" autoComplete="name" value={form.name} onChange={set('name')} required />
          <Field label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
          <Field
            label="Password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.password}
            onChange={set('password')}
            required
            hint="At least 8 characters."
          />
          <Field
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            required
          />
          <Alert>{error}</Alert>
          <Button type="submit" className="w-full" loading={loading}>
            Sign up
          </Button>
        </form>
        <p className="mt-6 text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="text-amber-400 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  )
}

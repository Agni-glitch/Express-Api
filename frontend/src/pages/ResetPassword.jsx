import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Alert, Button, Card, Field } from '../components/ui.jsx'

export default function ResetPassword() {
  const { token } = useParams()
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) return setError("Password and confirm password don't match.")
    setLoading(true)
    try {
      const res = await api(`/auth/resetPassword/${encodeURIComponent(token)}`, {
        method: 'PATCH',
        body: { password, confirmPassword },
        keepSession: true,
      })
      setSession(res.token, res.data.user)
      navigate('/movies', { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-2xl font-bold">Choose a new password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field
            label="New password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Field
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Alert>{error}</Alert>
          <Button type="submit" className="w-full" loading={loading}>
            Reset password
          </Button>
        </form>
        <p className="mt-6 text-sm text-zinc-400">
          Link expired?{' '}
          <Link to="/forgot-password" className="text-amber-400 hover:underline">
            Request a new one
          </Link>
        </p>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { Alert, Button, Card, Field } from '../components/ui.jsx'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSent(false)
    setLoading(true)
    try {
      await api('/auth/forgotPassword', { method: 'POST', body: { email }, keepSession: true })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="mt-1 text-sm text-zinc-400">Enter your email and we'll send you a reset link.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Alert>{error}</Alert>
          <Alert type="success">
            {sent && 'A reset link has been sent to your email. It is valid for 10 minutes.'}
          </Alert>
          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
        <p className="mt-6 text-sm text-zinc-400">
          Remembered it?{' '}
          <Link to="/login" className="text-amber-400 hover:underline">
            Back to log in
          </Link>
        </p>
      </Card>
    </div>
  )
}

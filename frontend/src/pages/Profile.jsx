import { useState } from 'react'
import { api } from '../api/client.js'
import { useAuth, useSignOut } from '../context/AuthContext.jsx'
import { Alert, Button, Card, Field, PageHeader } from '../components/ui.jsx'

function DetailsForm() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [status, setStatus] = useState({ error: '', success: '', loading: false })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ error: '', success: '', loading: true })
    try {
      const res = await api('/users/updateMe', { method: 'PATCH', body: { name, email } })
      updateUser(res.data.user)
      setStatus({ error: '', success: 'Your details have been updated.', loading: false })
    } catch (err) {
      setStatus({ error: err.message, success: '', loading: false })
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-bold">Your details</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Alert>{status.error}</Alert>
        <Alert type="success">{status.success}</Alert>
        <Button type="submit" loading={status.loading}>
          Save details
        </Button>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const { setSession } = useAuth()
  const empty = { currentPassword: '', password: '', confirmPassword: '' }
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState({ error: '', success: '', loading: false })

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return setStatus({ error: "New password and confirmation don't match.", success: '', loading: false })
    }
    setStatus({ error: '', success: '', loading: true })
    try {
      // a wrong current password comes back as 401 and must not end the session
      const res = await api('/users/updatePassword', { method: 'PATCH', body: form, keepSession: true })
      // the old token is no longer valid once the password changes
      setSession(res.token, res.data.user)
      setForm(empty)
      setStatus({ error: '', success: 'Your password has been changed.', loading: false })
    } catch (err) {
      setStatus({ error: err.message, success: '', loading: false })
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-bold">Change password</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Field
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={set('currentPassword')}
          required
        />
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={form.password}
          onChange={set('password')}
          required
        />
        <Field
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
          required
        />
        <Alert>{status.error}</Alert>
        <Alert type="success">{status.success}</Alert>
        <Button type="submit" loading={status.loading}>
          Change password
        </Button>
      </form>
    </Card>
  )
}

function DeactivateAccount() {
  const signOut = useSignOut()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDeactivate = async () => {
    if (!window.confirm('Deactivate your account? You will be logged out and will not be able to log in again.')) return
    setError('')
    setLoading(true)
    try {
      await api('/users/deleteMe', { method: 'DELETE' })
      signOut()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Card className="lg:col-span-2">
      <h2 className="text-lg font-bold">Deactivate account</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Your account will be switched off and you won't be able to log in with it again.
      </p>
      <div className="mt-4 space-y-3">
        <Alert>{error}</Alert>
        <Button variant="danger" loading={loading} onClick={handleDeactivate}>
          Deactivate my account
        </Button>
      </div>
    </Card>
  )
}

export default function Profile() {
  const { user } = useAuth()
  return (
    <div>
      <PageHeader title="Your account" subtitle={`${user.email} · ${user.role}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <DetailsForm />
        <PasswordForm />
        <DeactivateAccount />
      </div>
    </div>
  )
}

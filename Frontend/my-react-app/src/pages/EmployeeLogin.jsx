import { useState } from 'react'
import { Link } from 'react-router-dom'
import SplitLayout from '../layouts/SplitLayout'
import Input from '../components/Input'
import { login } from '../api/auth'
import { validateEmail } from '../utils/validation'

export default function EmployeeLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const next = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Password is required',
    }
    setErrors(next)
    setBanner('')
    setSuccess('')
    if (next.email || next.password) return

    setLoading(true)
    try {
      const session = await login({ ...form, role: 'Employee' })
      setSuccess(`Signed in as ${session.email}`)
    } catch (err) {
      setBanner(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SplitLayout
      footer={
        <Link className="back-link" to="/">
          ← Back to Role Selection
        </Link>
      }
    >
      <h1 className="panel-title">Employee Portal</h1>
      <p className="panel-sub">Sign in with your company email</p>
      {banner ? <div className="banner">{banner}</div> : null}
      {success ? <div className="banner success">{success}</div> : null}
      <form onSubmit={onSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="employee@dayflow.com"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <button className="primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </SplitLayout>
  )
}

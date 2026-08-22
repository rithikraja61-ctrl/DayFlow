import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SplitLayout from '../layouts/SplitLayout'
import Input from '../components/Input'
import { login, registerHr } from '../api/auth'
import { passwordChecks, validateEmail, validatePassword } from '../utils/validation'

export default function HrPortal() {
  const location = useLocation()
  const [tab, setTab] = useState(location.pathname === '/hr/new' ? 'signup' : 'login')
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState('')
  const [success, setSuccess] = useState(
    location.state?.registered ? 'Account created. You can log in now.' : '',
  )
  const [loading, setLoading] = useState(false)
  const checks = passwordChecks(form.password)

  function switchTab(next) {
    setTab(next)
    setBanner('')
    setSuccess('')
    setErrors({})
  }

  async function onSubmit(e) {
    e.preventDefault()
    const next = {
      email: validateEmail(form.email),
      password: tab === 'signup' ? validatePassword(form.password) : form.password ? '' : 'Password is required',
    }
    setErrors(next)
    setBanner('')
    setSuccess('')
    if (next.email || next.password) return

    setLoading(true)
    try {
      if (tab === 'signup') {
        await registerHr(form)
        setSuccess('Account created. You can log in now.')
        setTab('login')
        setForm((f) => ({ ...f, password: '' }))
      } else {
        const session = await login({ ...form, role: 'HR' })
        setSuccess(`Signed in as ${session.email}`)
      }
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
      <h1 className="panel-title">Admin Portal</h1>
      <div className="auth-tabs">
        <button type="button" className={tab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>
          Log in
        </button>
        <button type="button" className={tab === 'signup' ? 'active' : ''} onClick={() => switchTab('signup')}>
          Sign up
        </button>
      </div>
      {banner ? <div className="banner">{banner}</div> : null}
      {success ? <div className="banner success">{success}</div> : null}
      <form onSubmit={onSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="admin@dayflow.com"
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
        {tab === 'signup' ? (
          <ul className="checks">
            <li className={checks.length ? 'ok' : ''}>8+ characters</li>
            <li className={checks.upper ? 'ok' : ''}>Uppercase</li>
            <li className={checks.lower ? 'ok' : ''}>Lowercase</li>
            <li className={checks.number ? 'ok' : ''}>Number</li>
            <li className={checks.special ? 'ok' : ''}>Special character</li>
          </ul>
        ) : null}
        <button className="primary" disabled={loading}>
          {loading ? 'Please wait…' : tab === 'signup' ? 'Sign up' : 'Log in'}
        </button>
      </form>
    </SplitLayout>
  )
}

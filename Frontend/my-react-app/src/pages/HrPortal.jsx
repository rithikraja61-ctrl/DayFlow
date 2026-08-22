import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SplitLayout from '../layouts/SplitLayout'
import Input from '../components/Input'
import { login, registerHr } from '../api/auth'
import {
  passwordChecks,
  validateConfirm,
  validateEmail,
  validateLoginId,
  validatePassword,
  validatePhone,
  validateRequired,
} from '../utils/validation'

const emptySignup = {
  companyName: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export default function HrPortal() {
  const location = useLocation()
  const [tab, setTab] = useState(location.pathname === '/hr/new' ? 'signup' : 'login')
  const [loginForm, setLoginForm] = useState({ loginIdOrEmail: '', password: '' })
  const [signupForm, setSignupForm] = useState(emptySignup)
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const checks = passwordChecks(signupForm.password)

  function switchTab(next) {
    setTab(next)
    setBanner('')
    setSuccess('')
    setErrors({})
  }

  async function onLogin(e) {
    e.preventDefault()
    const next = {
      loginIdOrEmail: validateLoginId(loginForm.loginIdOrEmail),
      password: loginForm.password ? '' : 'Password is required',
    }
    setErrors(next)
    setBanner('')
    setSuccess('')
    if (next.loginIdOrEmail || next.password) return

    setLoading(true)
    try {
      const session = await login({ ...loginForm, role: 'HR' })
      setSuccess(`Signed in as ${session.email} (${session.loginId})`)
    } catch (err) {
      setBanner(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onSignup(e) {
    e.preventDefault()
    const next = {
      companyName: validateRequired(signupForm.companyName, 'Company name'),
      firstName: validateRequired(signupForm.firstName, 'First name'),
      lastName: validateRequired(signupForm.lastName, 'Last name'),
      email: validateEmail(signupForm.email),
      phone: validatePhone(signupForm.phone),
      password: validatePassword(signupForm.password),
      confirmPassword: validateConfirm(signupForm.password, signupForm.confirmPassword),
    }
    setErrors(next)
    setBanner('')
    setSuccess('')
    if (Object.values(next).some(Boolean)) return

    setLoading(true)
    try {
      const created = await registerHr(signupForm)
      setSuccess(`Account created. Your login ID is ${created.loginId}. Use it to log in.`)
      setTab('login')
      setLoginForm((f) => ({ ...f, loginIdOrEmail: created.email || signupForm.email, password: '' }))
      setSignupForm(emptySignup)
    } catch (err) {
      setBanner(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SplitLayout
      showPanelLogo
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

      {tab === 'login' ? (
        <form onSubmit={onLogin} noValidate>
          <Input
            label="Login ID or email"
            placeholder="admin@dayflow.com"
            value={loginForm.loginIdOrEmail}
            error={errors.loginIdOrEmail}
            onChange={(e) => setLoginForm((f) => ({ ...f, loginIdOrEmail: e.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={loginForm.password}
            error={errors.password}
            onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
          />
          <button className="primary" disabled={loading}>
            {loading ? 'Please wait…' : 'Log in'}
          </button>
        </form>
      ) : (
        <form onSubmit={onSignup} noValidate>
          <Input
            label="Company name"
            value={signupForm.companyName}
            error={errors.companyName}
            onChange={(e) => setSignupForm((f) => ({ ...f, companyName: e.target.value }))}
          />
          <Input
            label="First name"
            value={signupForm.firstName}
            error={errors.firstName}
            onChange={(e) => setSignupForm((f) => ({ ...f, firstName: e.target.value }))}
          />
          <Input
            label="Last name"
            value={signupForm.lastName}
            error={errors.lastName}
            onChange={(e) => setSignupForm((f) => ({ ...f, lastName: e.target.value }))}
          />
          <Input
            label="Work email"
            type="email"
            placeholder="admin@dayflow.com"
            value={signupForm.email}
            error={errors.email}
            onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Phone"
            placeholder="10-digit number"
            value={signupForm.phone}
            error={errors.phone}
            onChange={(e) => setSignupForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            value={signupForm.password}
            error={errors.password}
            onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))}
          />
          <ul className="checks">
            <li className={checks.length ? 'ok' : ''}>8+ characters</li>
            <li className={checks.upper ? 'ok' : ''}>Uppercase</li>
            <li className={checks.lower ? 'ok' : ''}>Lowercase</li>
            <li className={checks.special ? 'ok' : ''}>Special (!@#$%^&*)</li>
          </ul>
          <Input
            label="Confirm password"
            type="password"
            value={signupForm.confirmPassword}
            error={errors.confirmPassword}
            onChange={(e) => setSignupForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          />
          <button className="primary" disabled={loading}>
            {loading ? 'Please wait…' : 'Sign up'}
          </button>
        </form>
      )}
    </SplitLayout>
  )
}

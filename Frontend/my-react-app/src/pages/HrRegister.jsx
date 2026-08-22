import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/Input'
import { registerHr } from '../api/auth'
import {
  passwordChecks,
  validateConfirm,
  validateEmail,
  validateName,
  validateOrg,
  validatePassword,
} from '../utils/validation'

export default function HrRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState('')
  const [loading, setLoading] = useState(false)
  const checks = passwordChecks(form.password)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const next = {
      name: validateName(form.name),
      organization: validateOrg(form.organization),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
    }
    setErrors(next)
    setBanner('')
    if (Object.values(next).some(Boolean)) return

    setLoading(true)
    try {
      await registerHr(form)
      navigate('/hr/login', { state: { registered: true, email: form.email } })
    } catch (err) {
      setBanner(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create HR account" subtitle="Set up DayFlow for your organization">
      {banner ? <div className="banner">{banner}</div> : null}
      <form onSubmit={onSubmit} noValidate>
        <Input
          label="Full name"
          value={form.name}
          error={errors.name}
          onChange={(e) => set('name', e.target.value)}
          onBlur={() => setErrors((x) => ({ ...x, name: validateName(form.name) }))}
        />
        <Input
          label="Organization"
          value={form.organization}
          error={errors.organization}
          onChange={(e) => set('organization', e.target.value)}
          onBlur={() =>
            setErrors((x) => ({ ...x, organization: validateOrg(form.organization) }))
          }
        />
        <Input
          label="Work email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => set('email', e.target.value)}
          onBlur={() => setErrors((x) => ({ ...x, email: validateEmail(form.email) }))}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          error={errors.password}
          onChange={(e) => set('password', e.target.value)}
        />
        <ul className="checks">
          <li className={checks.length ? 'ok' : ''}>8+ characters</li>
          <li className={checks.upper ? 'ok' : ''}>Uppercase</li>
          <li className={checks.lower ? 'ok' : ''}>Lowercase</li>
          <li className={checks.number ? 'ok' : ''}>Number</li>
          <li className={checks.special ? 'ok' : ''}>Special character</li>
        </ul>
        <Input
          label="Confirm password"
          type="password"
          value={form.confirm}
          error={errors.confirm}
          onChange={(e) => set('confirm', e.target.value)}
        />
        <button className="primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Create HR account'}
        </button>
      </form>
      <p className="muted back-link">
        Already registered? <Link to="/hr/login">HR login</Link>
        {' · '}
        <Link to="/hr">Back</Link>
      </p>
    </AuthLayout>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Input from '../components/Input'
import { createEmployee } from '../api/employees'
import { validateEmail, validatePhone, validateRequired } from '../utils/validation'

export default function NewEmployee() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
  })
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState('')
  const [created, setCreated] = useState(null)
  const [loading, setLoading] = useState(false)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const next = {
      firstName: validateRequired(form.firstName, 'First name'),
      lastName: validateRequired(form.lastName, 'Last name'),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
    }
    setErrors(next)
    setBanner('')
    if (Object.values(next).some(Boolean)) return

    setLoading(true)
    try {
      const result = await createEmployee(form)
      setCreated(result)
    } catch (err) {
      setBanner(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Link to="/dashboard" className="detail-back">
        ← Back to Dashboard
      </Link>

      <div className="detail-card">
        <h1 className="panel-title">New Employee</h1>
        <p className="detail-hint">Create an employee account. A temporary password is generated automatically.</p>

        {banner ? <div className="banner">{banner}</div> : null}

        {created ? (
          <div className="banner success">
            <p>
              <strong>{created.fullName}</strong> created successfully.
            </p>
            <p>
              Login ID: <strong>{created.loginId}</strong>
            </p>
            <p>
              Temporary password: <strong>{created.temporaryPassword}</strong>
            </p>
            <p>Share these credentials securely. Employee should change password after first login.</p>
            <button type="button" className="primary" style={{ marginTop: 12 }} onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="detail-grid">
              <Input
                label="First name"
                value={form.firstName}
                error={errors.firstName}
                onChange={(e) => set('firstName', e.target.value)}
              />
              <Input
                label="Last name"
                value={form.lastName}
                error={errors.lastName}
                onChange={(e) => set('lastName', e.target.value)}
              />
              <Input
                label="Work email"
                type="email"
                placeholder="employee@company.com"
                value={form.email}
                error={errors.email}
                onChange={(e) => set('email', e.target.value)}
              />
              <Input
                label="Phone"
                placeholder="10-digit number"
                value={form.phone}
                error={errors.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
              <Input
                label="Department"
                placeholder="Engineering"
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
              />
              <Input
                label="Designation"
                placeholder="Software Engineer"
                value={form.designation}
                onChange={(e) => set('designation', e.target.value)}
              />
            </div>
            <button className="primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Employee'}
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}

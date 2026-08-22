import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'

export default function HrChoice() {
  const navigate = useNavigate()

  return (
    <AuthLayout title="HR access" subtitle="New to DayFlow, or already registered?">
      <div className="role-grid">
        <button type="button" className="role-card primary-card" onClick={() => navigate('/hr/new')}>
          <h2>New</h2>
          <p className="muted">Register your organization as HR</p>
        </button>
        <button type="button" className="role-card" onClick={() => navigate('/hr/login')}>
          <h2>Login</h2>
          <p className="muted">Sign in to an existing HR account</p>
        </button>
      </div>
      <p className="muted back-link">
        <Link to="/">Back to role</Link>
      </p>
    </AuthLayout>
  )
}

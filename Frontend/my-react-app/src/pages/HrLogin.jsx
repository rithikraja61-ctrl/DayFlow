import { Link, useLocation } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'

export default function HrLogin() {
  const { state } = useLocation()

  return (
    <AuthLayout title="HR login" subtitle="Sign in to an existing HR account">
      {state?.registered ? (
        <div className="banner success">Account created. You can sign in next.</div>
      ) : null}
      <p className="muted">Login form comes next. Use New if you still need an account.</p>
      <p className="muted back-link">
        <Link to="/hr/new">New HR</Link> · <Link to="/hr">Back</Link>
      </p>
    </AuthLayout>
  )
}

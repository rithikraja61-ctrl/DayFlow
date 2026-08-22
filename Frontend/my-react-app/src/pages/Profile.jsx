import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { getSession } from '../api/auth'

export default function Profile() {
  const session = getSession()

  return (
    <DashboardLayout>
      <div className="profile-placeholder">
        <h1>My Profile</h1>
        <p>
          Signed in as <strong>{session?.email}</strong>
          <br />
          Profile tabs coming in the next stage.
        </p>
        <Link to="/dashboard" className="detail-back">
          ← Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  )
}

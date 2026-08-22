import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

export default function NewEmployee() {
  return (
    <DashboardLayout>
      <Link to="/dashboard" className="detail-back">
        ← Back to Dashboard
      </Link>
      <div className="detail-card">
        <h1 className="panel-title">New Employee</h1>
        <p className="detail-hint">
          Employee creation form connects to the backend API in the next stage.
        </p>
        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">First name</span>
            <input type="text" placeholder="First name" disabled />
          </div>
          <div className="detail-field">
            <span className="detail-label">Last name</span>
            <input type="text" placeholder="Last name" disabled />
          </div>
          <div className="detail-field">
            <span className="detail-label">Work email</span>
            <input type="email" placeholder="employee@company.com" disabled />
          </div>
          <div className="detail-field">
            <span className="detail-label">Phone</span>
            <input type="text" placeholder="10-digit number" disabled />
          </div>
        </div>
        <p className="dash-muted">Enable backend to activate this form.</p>
      </div>
    </DashboardLayout>
  )
}

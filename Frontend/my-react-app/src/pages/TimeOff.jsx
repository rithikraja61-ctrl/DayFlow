import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

export default function TimeOff() {
  return (
    <DashboardLayout>
      <div className="dash-page-head">
        <h1>Time Off</h1>
        <p>Request and manage leave from this page.</p>
      </div>
      <div className="attendance-placeholder">
        <p>Time off requests and approvals will be built in the next stage.</p>
        <Link to="/dashboard" className="detail-back">
          ← Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  )
}

import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Attendance() {
  return (
    <DashboardLayout>
      <div className="dash-page-head">
        <h1>Attendance</h1>
        <p>Check-in history and attendance reports will appear here.</p>
      </div>
      <div className="attendance-placeholder">
        <p>Attendance module is the next stage. Use Dashboard to view team status for now.</p>
        <Link to="/dashboard" className="detail-back">
          ← Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  )
}

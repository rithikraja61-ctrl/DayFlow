import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { companyAttendanceToday } from '../api/attendance'
import { getSession } from '../api/auth'
import { EMPLOYEE_STATUS } from '../data/mockEmployees'

export default function Attendance() {
  const session = getSession()
  const isHr = session?.role === 'HR'
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(isHr && !session?.devUi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isHr || session?.devUi) {
      setLoading(false)
      return
    }
    let cancelled = false
    companyAttendanceToday()
      .then((rows) => {
        if (!cancelled) setRecords(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isHr, session?.devUi])

  return (
    <DashboardLayout>
      <div className="dash-page-head">
        <h1>Attendance</h1>
        <p>Today&apos;s clock-in board for your company.</p>
      </div>

      <ul className="status-legend">
        {Object.entries(EMPLOYEE_STATUS).map(([key, { label, color }]) => (
          <li key={key}>
            <span className={`status-dot status-${color}`} />
            {label}
          </li>
        ))}
      </ul>

      {!isHr ? (
        <div className="attendance-placeholder">
          <p>Use Clock In / Out on the Dashboard. Full history comes next.</p>
          <Link to="/dashboard" className="detail-back">
            ← Back to Dashboard
          </Link>
        </div>
      ) : null}

      {loading ? <p className="dash-muted">Loading…</p> : null}
      {error ? <div className="banner">{error}</div> : null}

      {isHr && !loading && records.length > 0 ? (
        <div className="detail-card detail-card-wide">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Login ID</th>
                <th>Status</th>
                <th>Clock in</th>
                <th>Clock out</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => {
                const key = String(row.status || 'ABSENT').toLowerCase()
                const meta = EMPLOYEE_STATUS[key] || EMPLOYEE_STATUS.absent
                return (
                  <tr key={row.id || row.loginId}>
                    <td>{row.fullName}</td>
                    <td>{row.loginId}</td>
                    <td>
                      <span className={`status-dot status-${meta.color}`} /> {meta.label}
                    </td>
                    <td>{row.clockInAt ? new Date(row.clockInAt).toLocaleTimeString() : '—'}</td>
                    <td>{row.clockOutAt ? new Date(row.clockOutAt).toLocaleTimeString() : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {isHr && !loading && records.length === 0 && !error ? (
        <div className="attendance-placeholder">
          <p>No clock-ins yet today. They appear here after employees clock in.</p>
          <Link to="/dashboard" className="detail-back">
            ← Back to Dashboard
          </Link>
        </div>
      ) : null}
    </DashboardLayout>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSession } from '../api/auth'
import { listEmployees } from '../api/employees'
import DashboardLayout from '../layouts/DashboardLayout'
import { EMPLOYEE_STATUS, getEmployeeById, toDashboardEmployee } from '../data/mockEmployees'

function Field({ label, value }) {
  return (
    <div className="detail-field">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || '—'}</span>
    </div>
  )
}

export default function EmployeeDetail() {
  const { id } = useParams()
  const session = getSession()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.role !== 'HR') {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')

    listEmployees()
      .then((rows) => {
        if (!cancelled) {
          const mapped = rows.map(toDashboardEmployee)
          setEmployee(getEmployeeById(id, mapped))
        }
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
  }, [id, session?.role])

  if (session?.role !== 'HR') {
    return (
      <DashboardLayout>
        <div className="detail-missing">
          <h1>Access restricted</h1>
          <p className="dash-muted">Only HR can view employee profiles from the dashboard.</p>
          <Link to="/dashboard" className="detail-back">
            ← Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="dash-muted">Loading employee…</p>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="banner">{error}</div>
        <Link to="/dashboard" className="detail-back">
          ← Back to Dashboard
        </Link>
      </DashboardLayout>
    )
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="detail-missing">
          <h1>Employee not found</h1>
          <Link to="/dashboard" className="detail-back">
            ← Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const status = EMPLOYEE_STATUS[employee.status] ?? EMPLOYEE_STATUS.absent
  const fullName = `${employee.firstName} ${employee.lastName}`
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()

  return (
    <DashboardLayout>
      <Link to="/dashboard" className="detail-back">
        ← Back to Dashboard
      </Link>

      <div className="detail-card">
        <div className="detail-header">
          <span className="detail-avatar">{initials}</span>
          <div className="detail-header-copy">
            <h1>{fullName}</h1>
            <p>{employee.role}</p>
            <span className={`detail-status status-${status.color}`}>{status.label}</span>
          </div>
        </div>

        <div className="detail-section">
          <h2>Work information</h2>
          <p className="detail-hint">
            View only — work details for HR. Private info and salary info are not shown on this
            screen.
          </p>
          <div className="detail-grid">
            <Field label="Employee ID" value={employee.loginId} />
            <Field label="Department" value={employee.department} />
            <Field label="Work email" value={employee.email} />
            <Field label="Phone" value={employee.phone} />
            <Field label="Role" value={employee.role} />
            <Field label="Join date" value={employee.joinDate} />
          </div>
        </div>

        <div className="detail-section">
          <h2>About</h2>
          <p className="detail-about">{employee.about}</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

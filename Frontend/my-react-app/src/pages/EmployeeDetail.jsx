import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { EMPLOYEE_STATUS, getEmployeeById } from '../data/mockEmployees'
import { useEmployees } from '../hooks/useEmployees'

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
  const { employees, loading, isHr } = useEmployees()
  const employee = getEmployeeById(id, employees)

  if (!isHr) {
    return (
      <DashboardLayout>
        <div className="detail-missing">
          <h1>Access restricted</h1>
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
            View only — work details for HR. Private info and salary info are not shown.
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

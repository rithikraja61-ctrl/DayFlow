import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { ReadOnlyBlock, ReadOnlyField } from '../components/ReadOnlyField'
import { EMPLOYEE_STATUS, getEmployeeById } from '../data/mockEmployees'
import { useEmployees } from '../hooks/useEmployees'

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

      <div className="detail-card detail-card-wide">
        <div className="detail-header">
          <span className="detail-avatar">{initials}</span>
          <div className="detail-header-copy">
            <h1>{fullName}</h1>
            <p>{employee.designation}</p>
            <span className={`detail-status status-${status.color}`}>{status.label}</span>
          </div>
        </div>

        <div className="detail-section">
          <h2>Personal</h2>
          <p className="detail-hint">View only — employee information in human readable mode.</p>
          <div className="detail-grid">
            <ReadOnlyField label="Employee ID" value={employee.loginId} />
            <ReadOnlyField label="Designation" value={employee.designation} />
            <ReadOnlyField label="Department" value={employee.department} />
            <ReadOnlyField label="Email" value={employee.email} />
            <ReadOnlyField label="Phone" value={employee.phone} />
            <ReadOnlyField label="Role" value={employee.role} />
            <ReadOnlyField label="Join date" value={employee.joinDate} />
          </div>
        </div>

        <div className="detail-section">
          <ReadOnlyBlock label="About" value={employee.about} />
          <ReadOnlyBlock label="What I love about my job…" value={employee.jobLove} />
          <ReadOnlyBlock label="My skills and hobbies…" value={employee.hobbies} />
        </div>

        <div className="detail-section detail-two-col">
          <ReadOnlyBlock label="Work" value={employee.workHistory} />
          <ReadOnlyBlock label="Education" value={employee.education} />
        </div>
      </div>
    </DashboardLayout>
  )
}

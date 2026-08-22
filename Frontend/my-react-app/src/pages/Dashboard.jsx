import DashboardLayout from '../layouts/DashboardLayout'
import EmployeeCard from '../components/EmployeeCard'
import { EMPLOYEE_STATUS } from '../data/mockEmployees'
import { useEmployees } from '../hooks/useEmployees'

export default function Dashboard() {
  const { employees, loading, usingSample, isHr } = useEmployees()

  if (!isHr) {
    return (
      <DashboardLayout>
        <div className="dash-page-head">
          <h1>Welcome back</h1>
          <p>Employee dashboard and check-in will be available in the next stage.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="dash-page-head">
        <h1>DayFlow</h1>
        <p>Click an employee card to view work details. Private and salary info are not shown.</p>
      </div>

      {usingSample ? (
        <div className="banner dev-sample-banner">
          Showing sample team data — connect backend for live employees.
        </div>
      ) : null}

      <ul className="status-legend" aria-label="Attendance status legend">
        {Object.entries(EMPLOYEE_STATUS).map(([key, { label, color }]) => (
          <li key={key}>
            <span className={`status-dot status-${color}`} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      {loading ? <p className="dash-muted">Loading employees…</p> : null}

      {!loading && employees.length ? (
        <div className="employee-grid">
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : null}

      {!loading && !employees.length ? (
        <p className="dash-muted">No employees yet.</p>
      ) : null}
    </DashboardLayout>
  )
}

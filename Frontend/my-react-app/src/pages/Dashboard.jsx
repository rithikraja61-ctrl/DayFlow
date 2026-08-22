import { useEffect, useState } from 'react'
import { getSession } from '../api/auth'
import { listEmployees } from '../api/employees'
import DashboardLayout from '../layouts/DashboardLayout'
import EmployeeCard from '../components/EmployeeCard'
import { EMPLOYEE_STATUS, toDashboardEmployee } from '../data/mockEmployees'

export default function Dashboard() {
  const session = getSession()
  const [employees, setEmployees] = useState([])
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
          setEmployees(rows.map(toDashboardEmployee))
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
  }, [session?.role])

  if (session?.role !== 'HR') {
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
        <h1>Team overview</h1>
        <p>Click an employee card to view work details. Private and salary info are not shown here.</p>
      </div>

      <ul className="status-legend" aria-label="Attendance status legend">
        {Object.entries(EMPLOYEE_STATUS).map(([key, { label, color }]) => (
          <li key={key}>
            <span className={`status-dot status-${color}`} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      {loading ? <p className="dash-muted">Loading employees…</p> : null}
      {error ? <div className="banner">{error}</div> : null}

      {!loading && !error ? (
        employees.length ? (
          <div className="employee-grid">
            {employees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        ) : (
          <p className="dash-muted">No employees yet. Create employees from HR admin after backend is set up.</p>
        )
      ) : null}
    </DashboardLayout>
  )
}

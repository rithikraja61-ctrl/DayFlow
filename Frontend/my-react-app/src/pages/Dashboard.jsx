import { useMemo, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import EmployeeCard from '../components/EmployeeCard'
import NewEmployeeCard from '../components/NewEmployeeCard'
import { EMPLOYEE_STATUS, filterEmployees } from '../data/mockEmployees'
import { useEmployees } from '../hooks/useEmployees'

export default function Dashboard() {
  const { employees, loading, usingSample, isHr } = useEmployees()
  const [search, setSearch] = useState('')
  const [clockedIn, setClockedIn] = useState(false)
  const [clockMsg, setClockMsg] = useState('')

  const filtered = useMemo(() => filterEmployees(employees, search), [employees, search])

  function handleClockIn() {
    setClockedIn(true)
    setClockMsg('Clocked in successfully. Your status is now Present.')
  }

  function handleClockOut() {
    setClockedIn(false)
    setClockMsg('Clocked out successfully.')
  }

  if (!isHr) {
    return (
      <DashboardLayout>
        <div className="dash-toolbar">
          <div className="clock-actions">
            <button type="button" className="clock-btn clock-in" onClick={handleClockIn} disabled={clockedIn}>
              Clock In
            </button>
            <button type="button" className="clock-btn clock-out" onClick={handleClockOut} disabled={!clockedIn}>
              Clock Out
            </button>
          </div>
        </div>
        {clockMsg ? <div className="banner success">{clockMsg}</div> : null}
        <div className="dash-page-head">
          <h1>Welcome back</h1>
          <p>Use Clock In when you arrive. Your status dot turns green on the team board.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout search={search} onSearchChange={setSearch}>
      <div className="dash-toolbar">
        <ul className="status-legend" aria-label="Attendance status legend">
          {Object.entries(EMPLOYEE_STATUS).map(([key, { label, color }]) => (
            <li key={key}>
              <span className={`status-dot status-${color}`} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <div className="clock-actions">
          <button type="button" className="clock-btn clock-in" onClick={handleClockIn} disabled={clockedIn}>
            Clock In
          </button>
          <button type="button" className="clock-btn clock-out" onClick={handleClockOut} disabled={!clockedIn}>
            Clock Out
          </button>
        </div>
      </div>

      {clockMsg ? <div className="banner success clock-banner">{clockMsg}</div> : null}

      {usingSample ? (
        <div className="banner dev-sample-banner">
          Showing sample team data — connect backend for live employees.
        </div>
      ) : null}

      {loading ? <p className="dash-muted">Loading employees…</p> : null}

      {!loading ? (
        <div className="employee-grid">
          <NewEmployeeCard />
          {filtered.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : null}

      {!loading && filtered.length === 0 && employees.length > 0 ? (
        <p className="dash-muted">No employees match your search.</p>
      ) : null}
    </DashboardLayout>
  )
}

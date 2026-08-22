import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import EmployeeCard from '../components/EmployeeCard'
import NewEmployeeCard from '../components/NewEmployeeCard'
import { clockIn, clockOut, todayAttendance } from '../api/attendance'
import { getSession } from '../api/auth'
import { EMPLOYEE_STATUS, filterEmployees } from '../data/mockEmployees'
import { useEmployees } from '../hooks/useEmployees'

export default function Dashboard() {
  const session = getSession()
  const { employees, loading, usingSample, isHr, reload } = useEmployees()
  const [search, setSearch] = useState('')
  const [clockedIn, setClockedIn] = useState(false)
  const [clockMsg, setClockMsg] = useState('')
  const [clockError, setClockError] = useState('')
  const [clockLoading, setClockLoading] = useState(false)

  const filtered = useMemo(() => filterEmployees(employees, search), [employees, search])

  useEffect(() => {
    if (!session?.token || session?.devUi) return
    todayAttendance()
      .then((data) => {
        setClockedIn(data.status === 'PRESENT' && !data.clockOutAt)
      })
      .catch(() => {})
  }, [session?.token, session?.devUi])

  async function handleClockIn() {
    setClockError('')
    setClockMsg('')
    if (session?.devUi) {
      setClockedIn(true)
      setClockMsg('Clocked in (demo). Status would turn Present.')
      return
    }
    setClockLoading(true)
    try {
      const data = await clockIn()
      setClockedIn(true)
      setClockMsg(data.message || 'Clocked in successfully. Status is Present.')
      reload?.()
    } catch (err) {
      setClockError(err.message)
    } finally {
      setClockLoading(false)
    }
  }

  async function handleClockOut() {
    setClockError('')
    setClockMsg('')
    if (session?.devUi) {
      setClockedIn(false)
      setClockMsg('Clocked out (demo).')
      return
    }
    setClockLoading(true)
    try {
      const data = await clockOut()
      setClockedIn(false)
      setClockMsg(data.message || 'Clocked out successfully.')
      reload?.()
    } catch (err) {
      setClockError(err.message)
    } finally {
      setClockLoading(false)
    }
  }

  const clockButtons = (
    <div className="clock-actions">
      <button type="button" className="clock-btn clock-in" onClick={handleClockIn} disabled={clockedIn || clockLoading}>
        Clock In
      </button>
      <button
        type="button"
        className="clock-btn clock-out"
        onClick={handleClockOut}
        disabled={!clockedIn || clockLoading}
      >
        Clock Out
      </button>
    </div>
  )

  if (!isHr) {
    return (
      <DashboardLayout>
        <div className="dash-toolbar">{clockButtons}</div>
        {clockMsg ? <div className="banner success">{clockMsg}</div> : null}
        {clockError ? <div className="banner">{clockError}</div> : null}
        <div className="dash-page-head">
          <h1>Welcome back</h1>
          <p>Clock In when you arrive — your status turns green on the team board.</p>
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
        {clockButtons}
      </div>

      {clockMsg ? <div className="banner success clock-banner">{clockMsg}</div> : null}
      {clockError ? <div className="banner">{clockError}</div> : null}

      {usingSample ? (
        <div className="banner dev-sample-banner">
          Sample data mode — sign up + create employees for live company data.
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

      {!loading && !usingSample && employees.length === 0 ? (
        <p className="dash-muted">No employees yet. Click + New Employee to add one.</p>
      ) : null}
    </DashboardLayout>
  )
}

import { useMemo, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { getSession } from '../api/auth'
import {
  TIME_OFF_TYPES,
  countWeekdays,
  dateStatusMap,
  formatDateDisplay,
  loadAllocation,
  loadRequests,
  publicHolidaysForYear,
  remainingBalance,
  saveRequests,
  typeLabel,
} from '../utils/timeOff'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DOT_CLASS = {
  APPROVED: 'dot-approved',
  PENDING: 'dot-pending',
  REJECTED: 'dot-rejected',
}

function displayName(session) {
  if (!session) return 'Employee'
  if (session.email) return session.email.split('@')[0].replace(/[._]/g, ' ')
  return session.loginId || 'Employee'
}

function MonthCalendar({ year, month, statusByDate, onDayClick }) {
  const first = new Date(year, month, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)

  return (
    <div className="to-cal-month">
      <h3>
        {MONTH_NAMES[month]} {year}
      </h3>
      <div className="to-cal-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) => (
          <span key={`${label}-${i}`}>{label}</span>
        ))}
      </div>
      <div className="to-cal-grid">
        {cells.map((day, idx) => {
          if (day == null) return <span key={`e-${idx}`} className="to-cal-empty" />
          const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const status = statusByDate.get(iso)
          return (
            <button
              key={iso}
              type="button"
              className={`to-cal-day${status ? ' marked' : ''}`}
              disabled={!status}
              onClick={() => status && onDayClick(iso, status)}
            >
              {day}
              {status ? <i className={`to-cal-dot ${DOT_CLASS[status]}`} aria-hidden="true" /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function TimeOff() {
  const session = getSession()
  const isHr = session?.role === 'HR'
  const myLogin = session?.loginId || session?.email || 'me'
  const myName = displayName(session)
  const calYear = new Date().getFullYear()

  const [section, setSection] = useState('time-off')
  const [requests, setRequests] = useState(() => {
    const all = loadRequests()
    if (session?.role !== 'EMPLOYEE') return all
    const mine = all.filter((r) => r.employeeLoginId === myLogin)
    if (mine.length > 0) return all
    const y = new Date().getFullYear()
    const demo = [
      {
        id: `to-demo-a-${myLogin}`,
        employeeName: myName,
        employeeLoginId: myLogin,
        type: 'PAID',
        startDate: `${y}-05-13`,
        endDate: `${y}-05-14`,
        days: 2,
        status: 'APPROVED',
        attachmentName: '',
        createdAt: Date.now() - 300000,
      },
      {
        id: `to-demo-p-${myLogin}`,
        employeeName: myName,
        employeeLoginId: myLogin,
        type: 'SICK',
        startDate: `${y}-08-20`,
        endDate: `${y}-08-20`,
        days: 1,
        status: 'PENDING',
        attachmentName: 'certificate.pdf',
        createdAt: Date.now() - 200000,
      },
      {
        id: `to-demo-r-${myLogin}`,
        employeeName: myName,
        employeeLoginId: myLogin,
        type: 'PAID',
        startDate: `${y}-07-08`,
        endDate: `${y}-07-08`,
        days: 1,
        status: 'REJECTED',
        attachmentName: '',
        createdAt: Date.now() - 100000,
      },
    ]
    const next = [...demo, ...all]
    saveRequests(next)
    return next
  })

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalClosing, setModalClosing] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [flashId, setFlashId] = useState(null)
  const [flashKind, setFlashKind] = useState('')
  const [form, setForm] = useState({
    type: 'PAID',
    startDate: '',
    endDate: '',
    attachmentName: '',
  })

  const allocation = loadAllocation()
  const balance = remainingBalance(requests, myLogin, allocation)
  const holidays = useMemo(() => publicHolidaysForYear(calYear), [calYear])

  const visibleRequests = useMemo(() => {
    let rows = isHr ? requests : requests.filter((r) => r.employeeLoginId === myLogin)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      rows = rows.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          typeLabel(r.type).toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q),
      )
    }
    return [...rows].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [requests, isHr, myLogin, search])

  const statusByDate = useMemo(() => dateStatusMap(requests, myLogin), [requests, myLogin])
  const allocationDays = countWeekdays(form.startDate, form.endDate)

  function persist(next) {
    setRequests(next)
    saveRequests(next)
  }

  function showToast(message, kind = 'info') {
    setToast({ message, kind })
    window.setTimeout(() => setToast(null), 2200)
  }

  function closeModal() {
    setModalClosing(true)
    window.setTimeout(() => {
      setModalOpen(false)
      setModalClosing(false)
    }, 180)
  }

  function openModal() {
    setError('')
    setForm({ type: 'PAID', startDate: '', endDate: '', attachmentName: '' })
    setModalClosing(false)
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.startDate || !form.endDate) {
      setError('Select a validity period.')
      return
    }
    if (form.endDate < form.startDate) {
      setError('End date must be on or after start date.')
      return
    }
    const days = countWeekdays(form.startDate, form.endDate)
    if (days < 1) {
      setError('Selected range has no working days.')
      return
    }
    if (form.type === 'SICK' && !form.attachmentName) {
      setError('Attach a sick leave certificate.')
      return
    }
    if (form.type === 'PAID' && days > balance.paid) {
      setError(`Only ${balance.paid} paid days remaining.`)
      return
    }
    if (form.type === 'SICK' && days > balance.sick) {
      setError(`Only ${balance.sick} sick days remaining.`)
      return
    }

    persist([
      {
        id: `to-${Date.now()}`,
        employeeName: myName,
        employeeLoginId: myLogin,
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        days,
        status: 'PENDING',
        attachmentName: form.attachmentName || '',
        createdAt: Date.now(),
      },
      ...requests,
    ])
    closeModal()
    showToast('Time off request submitted', 'info')
  }

  function setStatus(id, status) {
    persist(requests.map((r) => (r.id === id ? { ...r, status } : r)))
    setFlashId(id)
    setFlashKind(status === 'APPROVED' ? 'ok' : 'no')
    showToast(
      status === 'APPROVED' ? 'Request approved' : 'Request rejected',
      status === 'APPROVED' ? 'ok' : 'no',
    )
    window.setTimeout(() => {
      setFlashId(null)
      setFlashKind('')
    }, 900)
  }

  function onDayClick(iso, status) {
    const label =
      status === 'APPROVED' ? 'Validated' : status === 'PENDING' ? 'To Approve' : 'Refused'
    showToast(
      `${formatDateDisplay(iso)} · ${label}`,
      status === 'APPROVED' ? 'ok' : status === 'REJECTED' ? 'no' : 'info',
    )
  }

  const paidShown = isHr ? allocation.paidDays : balance.paid
  const sickShown = isHr ? allocation.sickDays : balance.sick

  return (
    <DashboardLayout>
      <div className="to-layout">
        <aside className="to-side">
          <button
            type="button"
            className={section === 'time-off' ? 'active' : ''}
            onClick={() => setSection('time-off')}
          >
            Time Off
          </button>
          <button
            type="button"
            className={section === 'allocation' ? 'active' : ''}
            onClick={() => setSection('allocation')}
          >
            Allocation
          </button>
        </aside>

        <div className="to-main">
          <div className="dash-page-head to-head">
            <div>
              <h1>Time Off</h1>
              <p>
                {isHr
                  ? 'Review and approve leave for your company.'
                  : 'Request leave and track your year on the calendar.'}
              </p>
            </div>
            <button type="button" className="to-new-btn" onClick={openModal}>
              NEW
            </button>
          </div>

          {(section === 'allocation' || section === 'time-off') && (
            <div className={`to-stats${section === 'time-off' ? ' to-stats-inline' : ''}`}>
              <div className="to-stat-card">
                <span>Paid time Off</span>
                <strong>{String(paidShown).padStart(2, '0')} Days Available</strong>
              </div>
              <div className="to-stat-card">
                <span>Sick time off</span>
                <strong>{String(sickShown).padStart(2, '0')} Days Available</strong>
              </div>
              {section === 'allocation' ? (
                <p className="to-note">
                  Types: Paid Time Off · Sick Leave · Unpaid Leaves. Employees see only their own
                  records; Admins and HR Officers can view all and approve/reject.
                </p>
              ) : null}
            </div>
          )}

          {section === 'time-off' && isHr ? (
            <>
              <div className="to-toolbar">
                <input
                  type="search"
                  className="to-search"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search time off"
                />
              </div>
              <div className="detail-card detail-card-wide to-table-wrap">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Time off Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRequests.map((row) => (
                      <tr
                        key={row.id}
                        className={
                          flashId === row.id
                            ? flashKind === 'ok'
                              ? 'to-row-ok'
                              : 'to-row-no'
                            : undefined
                        }
                      >
                        <td>{row.employeeName}</td>
                        <td>{formatDateDisplay(row.startDate)}</td>
                        <td>{formatDateDisplay(row.endDate)}</td>
                        <td>{typeLabel(row.type)}</td>
                        <td>
                          <span className={`to-status to-status-${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                        <td>
                          {row.status === 'PENDING' ? (
                            <div className="to-actions">
                              <button
                                type="button"
                                className="to-reject"
                                onClick={() => setStatus(row.id, 'REJECTED')}
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                className="to-approve"
                                onClick={() => setStatus(row.id, 'APPROVED')}
                              >
                                Approve
                              </button>
                            </div>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visibleRequests.length === 0 ? (
                  <p className="dash-muted to-empty">No time off requests yet.</p>
                ) : null}
              </div>
            </>
          ) : null}

          {section === 'time-off' && !isHr ? (
            <div className="to-employee-board">
              <div className="to-year-cal">
                {Array.from({ length: 12 }, (_, month) => (
                  <MonthCalendar
                    key={month}
                    year={calYear}
                    month={month}
                    statusByDate={statusByDate}
                    onDayClick={onDayClick}
                  />
                ))}
              </div>
              <aside className="to-cal-sidebar">
                <div className="to-legend">
                  <h3>Legend</h3>
                  <ul>
                    <li>
                      <i className="to-cal-dot dot-approved" /> Validated
                    </li>
                    <li>
                      <i className="to-cal-dot dot-pending" /> To Approve
                    </li>
                    <li>
                      <i className="to-cal-dot dot-rejected" /> Refused
                    </li>
                  </ul>
                </div>
                <div className="to-holidays">
                  <h3>Public holidays {calYear}</h3>
                  <ul>
                    {holidays.map((h) => (
                      <li key={h.date}>
                        <span>{formatDateDisplay(h.date)}</span>
                        <span>{h.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </div>

      {modalOpen ? (
        <div
          className={`to-modal-backdrop${modalClosing ? ' closing' : ''}`}
          role="presentation"
          onClick={closeModal}
        >
          <div
            className="to-modal"
            role="dialog"
            aria-labelledby="to-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="to-modal-title">Time off Type Request</h2>
            <form onSubmit={handleSubmit} className="to-modal-form">
              <label>
                Employee
                <input type="text" value={myName} readOnly />
              </label>
              <label>
                Time off Type
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  {TIME_OFF_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="to-date-row">
                <label>
                  From
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  />
                </label>
              </div>
              <label>
                Allocation
                <input type="text" readOnly value={`${allocationDays.toFixed(2)} Days`} />
              </label>
              <label>
                Attachment (for sick leave certificate)
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      attachmentName: e.target.files?.[0]?.name || '',
                    }))
                  }
                />
              </label>
              {form.attachmentName ? (
                <p className="to-attach-name">Selected: {form.attachmentName}</p>
              ) : null}
              {error ? <div className="banner">{error}</div> : null}
              <div className="to-modal-actions">
                <button type="submit" className="to-submit">
                  Submit
                </button>
                <button type="button" className="to-cancel" onClick={closeModal}>
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className={`to-toast ${toast.kind}`} role="status">
          {toast.message}
        </div>
      ) : null}
    </DashboardLayout>
  )
}

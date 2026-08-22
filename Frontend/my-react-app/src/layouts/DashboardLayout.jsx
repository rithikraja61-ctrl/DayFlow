import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCompanyLogo, getSession, logout } from '../api/auth'
import ProfileMenu from '../components/ProfileMenu'

export default function DashboardLayout({ children, search, onSearchChange }) {
  const navigate = useNavigate()
  const session = getSession()
  const companyLogo = getCompanyLogo()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link to="/dashboard" className="dash-logo">
            <img src={companyLogo || '/logo.svg'} alt="" className="dash-logo-img" />
            <span>Dayflow</span>
          </Link>
          <nav className="dash-nav" aria-label="Main">
            <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Dashboard
            </NavLink>
            <NavLink to="/attendance" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Attendance
            </NavLink>
            <NavLink to="/time-off" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Time Off
            </NavLink>
          </nav>
          <div className="dash-header-actions">
            {onSearchChange ? (
              <div className="dash-search-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  className="dash-search"
                  placeholder="Search employees…"
                  value={search ?? ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  aria-label="Search employees"
                />
              </div>
            ) : null}
            <ProfileMenu session={session} onLogout={handleLogout} />
          </div>
        </div>
        <div className="dash-accent-bar" aria-hidden="true" />
      </header>
      <main className="dash-main">{children}</main>
    </div>
  )
}

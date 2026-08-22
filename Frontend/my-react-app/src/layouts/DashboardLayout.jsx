import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../api/auth'
import ProfileMenu from '../components/ProfileMenu'

export default function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const session = getSession()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link to="/dashboard" className="dash-logo">
            <img src="/logo.svg" alt="" className="dash-logo-img" />
            <span>Dayflow</span>
          </Link>
          <nav className="dash-nav" aria-label="Main">
            <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Dashboard
            </NavLink>
            <NavLink to="/attendance" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Attendance
            </NavLink>
            <span className="dash-nav-soon">Time Off</span>
          </nav>
          <ProfileMenu session={session} onLogout={handleLogout} />
        </div>
        <div className="dash-accent-bar" aria-hidden="true" />
      </header>
      <main className="dash-main">{children}</main>
    </div>
  )
}

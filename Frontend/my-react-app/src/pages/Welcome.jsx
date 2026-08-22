import { useNavigate } from 'react-router-dom'
import SplitLayout from '../layouts/SplitLayout'

function LaptopIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden="true">
      <circle cx="13" cy="6.5" r="3.2" fill="#E8C39A" />
      <path d="M8 14.5c1.2-2.4 3-3.4 5-3.4s3.8 1 5 3.4" stroke="#5e3e57" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="4" y="15" width="18" height="4.5" rx="1.2" fill="#8b6b86" />
      <rect x="6.5" y="12.2" width="13" height="3.2" rx="0.6" fill="#c4a3be" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.1" stroke="#8b6b86" strokeWidth="1.7" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.5 1.5M16.4 16.4l1.5 1.5M17.9 6.1l-1.5 1.5M7.6 16.4l-1.5 1.5"
        stroke="#8b6b86"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <SplitLayout>
      <h1 className="panel-title">Select your role</h1>
      <p className="panel-sub">To continue to the portal, please identify your role.</p>
      <div className="role-list">
        <button type="button" className="role-card" onClick={() => navigate('/employee/login')}>
          <span className="role-icon">
            <LaptopIcon />
          </span>
          <div>
            <strong>Employee Portal</strong>
            <span>View attendance & request time-off</span>
          </div>
        </button>
        <button type="button" className="role-card" onClick={() => navigate('/hr')}>
          <span className="role-icon">
            <GearIcon />
          </span>
          <div>
            <strong>HR / Admin</strong>
            <span>Manage employees & approvals</span>
          </div>
        </button>
      </div>
    </SplitLayout>
  )
}

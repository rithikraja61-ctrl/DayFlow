import { useNavigate } from 'react-router-dom'
import SplitLayout from '../layouts/SplitLayout'

function EmployeeIcon() {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
      <circle cx="14" cy="6" r="3.4" fill="#E8C39A" />
      <path d="M14 10.2c2.6 0 4.8 1.4 5.6 3.6H8.4c.8-2.2 3-3.6 5.6-3.6Z" fill="#F3D7B5" />
      <rect x="5" y="16.2" width="18" height="5.2" rx="1.4" fill="#8B6B86" />
      <rect x="8" y="13.6" width="12" height="3.4" rx="0.7" fill="#C4A3BE" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="#8B6B86"
        strokeWidth="1.7"
      />
      <path
        d="M19.2 13.05c.05-.34.08-.7.08-1.05s-.03-.71-.08-1.05l2.02-1.58-1.9-3.3-2.4.96a7.3 7.3 0 0 0-1.82-1.05L14.7 3h-5.4l-.4 2.98c-.66.24-1.27.59-1.82 1.05l-2.4-.96-1.9 3.3 2.02 1.58c-.05.34-.08.7-.08 1.05s.03.71.08 1.05L3.18 14.6l1.9 3.3 2.4-.96c.55.46 1.16.81 1.82 1.05L9.3 21h5.4l.4-2.98c.66-.24 1.27-.59 1.82-1.05l2.4.96 1.9-3.3-2.02-1.58Z"
        stroke="#8B6B86"
        strokeWidth="1.5"
        strokeLinejoin="round"
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
            <EmployeeIcon />
          </span>
          <div className="role-copy">
            <strong>Employee Portal</strong>
            <p>View attendance & request time-off</p>
          </div>
        </button>
        <button type="button" className="role-card" onClick={() => navigate('/hr')}>
          <span className="role-icon">
            <GearIcon />
          </span>
          <div className="role-copy">
            <strong>HR / Admin</strong>
            <p>Manage employees & approvals</p>
          </div>
        </button>
      </div>
    </SplitLayout>
  )
}

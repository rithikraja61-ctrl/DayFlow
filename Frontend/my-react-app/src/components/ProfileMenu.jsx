import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function initials(session) {
  if (session?.email) return session.email[0].toUpperCase()
  return '?'
}

export default function ProfileMenu({ session, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="profile-menu" ref={ref}>
      <button
        type="button"
        className="profile-avatar"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {initials(session)}
      </button>
      {open ? (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-meta">
            <strong>{session?.email}</strong>
            <span>{session?.loginId}</span>
          </div>
          <Link to="/profile" className="profile-dropdown-item" role="menuitem" onClick={() => setOpen(false)}>
            My Profile
          </Link>
          <button type="button" className="profile-dropdown-item danger" role="menuitem" onClick={onLogout}>
            Log Out
          </button>
        </div>
      ) : null}
    </div>
  )
}

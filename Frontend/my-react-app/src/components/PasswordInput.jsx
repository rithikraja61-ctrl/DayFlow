import { useState } from 'react'

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a18.2 18.2 0 0 1-4.1 5.2M6.1 6.1A18.5 18.5 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 5-1.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function PasswordInput({ label, error, className = '', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className={`field ${className}`.trim()}>
      <span>{label}</span>
      <div className="password-wrap">
        <input
          className={error ? 'invalid' : ''}
          type={visible ? 'text' : 'password'}
          {...props}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {error ? <small className="error">{error}</small> : null}
    </label>
  )
}

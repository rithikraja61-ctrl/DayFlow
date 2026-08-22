import { Link } from 'react-router-dom'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-page">
      <header className="brand">
        <Link to="/" className="brand-link">
          <img src="/logo.svg" alt="DayFlow" height={40} />
          <span>DayFlow</span>
        </Link>
      </header>
      <main className="auth-card">
        <h1>{title}</h1>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
        {children}
      </main>
    </div>
  )
}

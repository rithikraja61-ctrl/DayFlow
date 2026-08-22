export default function SplitLayout({
  children,
  footer,
  showPanelLogo = false,
  heroTitle = 'Welcome to Dayflow',
  heroSubtitle = 'Your centralized HR platform for attendance, leave requests, and team management — built to keep every workday running smoothly.',
}) {
  return (
    <div className="split">
      <section className="hero">
        <span className="circle circle-tl" />
        <span className="circle circle-mid" />
        <span className="circle circle-br" />
        <span className="circle circle-sm" />
        <div className="hero-copy">
          <p className="hero-brand">Dayflow</p>
          <h1>{heroTitle}</h1>
          <p className="hero-sub">{heroSubtitle}</p>
          <ul className="hero-features">
            <li>Real-time attendance tracking</li>
            <li>Leave requests &amp; approvals</li>
            <li>One workspace for HR &amp; teams</li>
          </ul>
        </div>
      </section>
      <section className="panel">
        <div className="panel-inner">
          <div className="panel-body">
            {showPanelLogo ? (
              <div className="panel-logo-wrap">
                <img src="/logo.svg" alt="DayFlow" className="panel-logo" />
              </div>
            ) : null}
            {children}
          </div>
          {footer ? <div className="panel-footer">{footer}</div> : <div className="panel-footer" />}
        </div>
      </section>
    </div>
  )
}

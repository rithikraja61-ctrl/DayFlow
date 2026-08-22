import { Link } from 'react-router-dom'

export default function SplitLayout({ children, footer }) {
  return (
    <div className="split">
      <section className="hero">
        <span className="circle circle-tl" />
        <span className="circle circle-mid" />
        <span className="circle circle-br" />
        <div className="hero-copy">
          <h1>
            Every workday,
            <br />
            perfectly aligned.
          </h1>
          <p>Your all-in-one HR workspace.</p>
        </div>
      </section>
      <section className="panel">
        <Link to="/" className="wordmark">
          Dayflow
        </Link>
        <div className="panel-body">{children}</div>
        {footer ? <div className="panel-footer">{footer}</div> : <div className="panel-footer" />}
      </section>
    </div>
  )
}

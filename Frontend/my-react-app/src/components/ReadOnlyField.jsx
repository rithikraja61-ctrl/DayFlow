export function ReadOnlyField({ label, value }) {
  return (
    <div className="detail-field">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || '—'}</span>
    </div>
  )
}

export function ReadOnlyBlock({ label, value }) {
  return (
    <div className="detail-block">
      <span className="detail-label">{label}</span>
      <p className="detail-about">{value || '—'}</p>
    </div>
  )
}

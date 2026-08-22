import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ProfileTabs from '../components/ProfileTabs'
import SalaryInfoTab from '../components/SalaryInfoTab'
import { ReadOnlyField } from '../components/ReadOnlyField'
import { getSession } from '../api/auth'

const PROFILE_EXTRA_KEY = 'dayflow_my_profile_extra'

function loadExtra(loginId) {
  try {
    const raw = localStorage.getItem(`${PROFILE_EXTRA_KEY}:${loginId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveExtra(loginId, data) {
  localStorage.setItem(`${PROFILE_EXTRA_KEY}:${loginId}`, JSON.stringify(data))
}

function displayNameFromSession(session) {
  if (!session) return 'My Name'
  if (session.email) {
    return session.email
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }
  return session.loginId || 'My Name'
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5l3 3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function EditableSection({ title, value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function startEdit() {
    setDraft(value)
    setEditing(true)
  }

  function save() {
    onChange(draft.trim() || value)
    setEditing(false)
  }

  return (
    <section className="profile-bio-block">
      <div className="profile-bio-head">
        <h3>{title}</h3>
        {!editing ? (
          <button type="button" className="profile-edit-icon" onClick={startEdit} aria-label={`Edit ${title}`}>
            <PencilIcon />
          </button>
        ) : null}
      </div>
      {editing ? (
        <div className="profile-bio-edit">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} />
          <div className="profile-bio-edit-actions">
            <button type="button" className="to-submit" onClick={save}>
              Save
            </button>
            <button type="button" className="to-cancel" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>{value}</p>
      )}
    </section>
  )
}

function ChipPanel({ title, items, onAdd, addLabel }) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  function submitAdd(e) {
    e.preventDefault()
    const next = draft.trim()
    if (!next) return
    onAdd(next)
    setDraft('')
    setAdding(false)
  }

  return (
    <div className="profile-chip-panel">
      <h3>{title}</h3>
      <div className="profile-chips">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      {adding ? (
        <form className="profile-add-form" onSubmit={submitAdd}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`New ${title.toLowerCase().slice(0, -1) || 'item'}`}
            autoFocus
          />
          <button type="submit" className="to-submit">
            Add
          </button>
          <button type="button" className="to-cancel" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button type="button" className="profile-add-link" onClick={() => setAdding(true)}>
          + {addLabel}
        </button>
      )}
    </div>
  )
}

export default function Profile() {
  const session = getSession()
  const isHr = session?.role === 'HR'
  const loginId = session?.loginId || session?.email || 'default'
  const initials = (session?.email?.[0] || session?.loginId?.[0] || '?').toUpperCase()
  const displayName = displayNameFromSession(session)

  const defaults = useMemo(
    () => ({
      mobile: '—',
      department: isHr ? 'Human Resources' : 'Engineering',
      manager: '—',
      location: 'Chennai',
      about: 'Team member focused on keeping every workday aligned through DayFlow.',
      loveJob: 'Building clear workflows and helping the team stay organized.',
      hobbies: 'Product thinking, mentoring, and continuous learning.',
      skills: isHr
        ? ['Communication', 'Teamwork', 'HR tools']
        : ['Communication', 'Teamwork', 'Problem solving'],
      certifications: isHr
        ? ['Workplace Safety', 'HR Fundamentals']
        : ['Workplace Safety', 'Onboarding Basics'],
    }),
    [isHr],
  )

  const [extra, setExtra] = useState(() => ({ ...defaults, ...(loadExtra(loginId) || {}) }))

  function patchExtra(partial) {
    setExtra((prev) => {
      const next = { ...prev, ...partial }
      saveExtra(loginId, next)
      return next
    })
  }

  const resume = {
    id: 'resume',
    label: 'Resume',
    content: (
      <div className="profile-resume-grid">
        <div className="profile-resume-left">
          <EditableSection
            title="About"
            value={extra.about}
            onChange={(about) => patchExtra({ about })}
          />
          <EditableSection
            title="What I love about my job"
            value={extra.loveJob}
            onChange={(loveJob) => patchExtra({ loveJob })}
          />
          <EditableSection
            title="My interests and hobbies"
            value={extra.hobbies}
            onChange={(hobbies) => patchExtra({ hobbies })}
          />
        </div>
        <div className="profile-resume-right">
          <ChipPanel
            title="Skills"
            items={extra.skills}
            addLabel="Add Skills"
            onAdd={(skill) =>
              setExtra((prev) => {
                const skills = prev.skills.includes(skill) ? prev.skills : [...prev.skills, skill]
                const next = { ...prev, skills }
                saveExtra(loginId, next)
                return next
              })
            }
          />
          <ChipPanel
            title="Certification"
            items={extra.certifications}
            addLabel="Add Certification"
            onAdd={(cert) =>
              setExtra((prev) => {
                const certifications = prev.certifications.includes(cert)
                  ? prev.certifications
                  : [...prev.certifications, cert]
                const next = { ...prev, certifications }
                saveExtra(loginId, next)
                return next
              })
            }
          />
        </div>
      </div>
    ),
  }

  const privateInfo = {
    id: 'private',
    label: 'Private Info',
    content: (
      <div className="profile-tab-body">
        <p className="detail-hint">Sensitive personal &amp; bank details — view only on this screen.</p>
        <h3 className="profile-subhead">Personal</h3>
        <div className="detail-grid">
          <ReadOnlyField label="Date of birth" value="—" />
          <ReadOnlyField label="Personal email" value="—" />
          <ReadOnlyField label="Gender" value="—" />
          <ReadOnlyField label="Nationality" value="Indian" />
          <ReadOnlyField label="Marital status" value="—" />
          <ReadOnlyField label="Residing address" value="—" />
          <ReadOnlyField label="Blood group" value="—" />
          <ReadOnlyField label="Emergency contact" value="—" />
        </div>
        <h3 className="profile-subhead">Bank details</h3>
        <div className="detail-grid">
          <ReadOnlyField label="Bank name" value="—" />
          <ReadOnlyField label="Account number" value="—" />
          <ReadOnlyField label="IFSC code" value="—" />
          <ReadOnlyField label="Branch" value="—" />
          <ReadOnlyField label="PAN" value="—" />
          <ReadOnlyField label="Aadhaar" value="—" />
        </div>
      </div>
    ),
  }

  const salary = {
    id: 'salary',
    label: 'Salary Info',
    content: <SalaryInfoTab loginId={loginId} editable={isHr} />,
  }

  const tabs = isHr ? [resume, privateInfo, salary] : [resume, privateInfo]

  return (
    <DashboardLayout>
      <Link to="/dashboard" className="detail-back">
        ← Back to Dashboard
      </Link>

      <div className="detail-card detail-card-wide profile-my-card">
        <h1 className="profile-my-title">My Profile</h1>

        <div className="profile-overview">
          <div className="profile-avatar-wrap">
            <span className="profile-overview-avatar">{initials}</span>
            <button type="button" className="profile-avatar-edit" aria-label="Edit photo">
              <PencilIcon />
            </button>
          </div>

          <div className="profile-overview-mid">
            <h2 className="profile-overview-name">{displayName}</h2>
            <div className="profile-underline-fields">
              <div className="profile-underline-field">
                <span>Login ID</span>
                <strong>{session?.loginId || '—'}</strong>
              </div>
              <div className="profile-underline-field">
                <span>Email</span>
                <strong>{session?.email || '—'}</strong>
              </div>
              <div className="profile-underline-field">
                <span>Mobile</span>
                <strong>{extra.mobile}</strong>
              </div>
            </div>
          </div>

          <div className="profile-overview-right">
            <div className="profile-underline-fields">
              <div className="profile-underline-field">
                <span>Company</span>
                <strong>{session?.companyName || 'DayFlow'}</strong>
              </div>
              <div className="profile-underline-field">
                <span>Department</span>
                <strong>{extra.department}</strong>
              </div>
              <div className="profile-underline-field">
                <span>Manager</span>
                <strong>{extra.manager}</strong>
              </div>
              <div className="profile-underline-field">
                <span>Location</span>
                <strong>{extra.location}</strong>
              </div>
            </div>
          </div>
        </div>

        <ProfileTabs tabs={tabs} defaultTab="resume" />
      </div>
    </DashboardLayout>
  )
}

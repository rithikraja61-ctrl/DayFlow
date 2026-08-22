import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ProfileTabs from '../components/ProfileTabs'
import SalaryInfoTab from '../components/SalaryInfoTab'
import { ReadOnlyBlock, ReadOnlyField } from '../components/ReadOnlyField'
import { getSession } from '../api/auth'

export default function Profile() {
  const session = getSession()
  const isHr = session?.role === 'HR'
  const initials = session?.email ? session.email[0].toUpperCase() : '?'
  const displayName = session?.email?.split('@')[0]?.replace(/[._]/g, ' ') || 'My Name'

  const personal = {
    id: 'personal',
    label: 'Personal',
    content: (
      <div className="profile-tab-body">
        <div className="detail-grid">
          <ReadOnlyField label="Mobile" value="—" />
          <ReadOnlyField label="Email" value={session?.email} />
          <ReadOnlyField label="Department" value={isHr ? 'Human Resources' : 'Engineering'} />
          <ReadOnlyField label="Job position" value={isHr ? 'HR Admin' : 'Employee'} />
          <ReadOnlyField label="Manager" value="—" />
          <ReadOnlyField label="Location" value="—" />
          <ReadOnlyField label="Company" value={session?.companyName || '—'} />
          <ReadOnlyField label="Date of joining" value="—" />
        </div>
        <ReadOnlyBlock
          label="About"
          value="Team member focused on keeping every workday aligned through DayFlow."
        />
        <ReadOnlyBlock
          label="What I love about my job"
          value="Building clear workflows and helping the team stay organized."
        />
        <ReadOnlyBlock
          label="My interests and hobbies"
          value="Product thinking, mentoring, and continuous learning."
        />
        <div className="profile-chips-block">
          <span className="detail-label">Skills</span>
          <div className="profile-chips">
            <span>Communication</span>
            <span>Teamwork</span>
            <span>HR tools</span>
          </div>
        </div>
        <div className="profile-chips-block">
          <span className="detail-label">Certificates</span>
          <div className="profile-chips">
            <span>Workplace Safety</span>
            <span>HR Fundamentals</span>
          </div>
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
    content: (
      <SalaryInfoTab loginId={session?.loginId || 'default'} editable={isHr} />
    ),
  }

  const security = {
    id: 'security',
    label: 'Security',
    content: (
      <div className="profile-tab-body">
        <div className="detail-grid">
          <ReadOnlyField label="Login ID" value={session?.loginId} />
          <ReadOnlyField label="Work email" value={session?.email} />
          <ReadOnlyField label="Role" value={session?.role} />
          <ReadOnlyField label="Two-factor auth" value="Not enabled" />
          <ReadOnlyField label="Last password change" value="—" />
          <ReadOnlyField label="Active sessions" value="1 device" />
        </div>
      </div>
    ),
  }

  // Wireframe: Salary Info tab visible to Admin/HR only
  const tabs = isHr
    ? [personal, privateInfo, salary, security]
    : [personal, privateInfo, security]

  return (
    <DashboardLayout>
      <Link to="/dashboard" className="detail-back">
        ← Back to Dashboard
      </Link>

      <div className="detail-card detail-card-wide">
        <div className="detail-header">
          <span className="detail-avatar">{initials}</span>
          <div className="detail-header-copy">
            <h1 style={{ textTransform: 'capitalize' }}>{displayName}</h1>
            <p>{session?.companyName || 'DayFlow'}</p>
            <span className="detail-status status-green">{isHr ? 'HR / Admin' : 'Employee'}</span>
          </div>
        </div>

        <div className="detail-grid profile-header-fields">
          <ReadOnlyField label="Login ID" value={session?.loginId} />
          <ReadOnlyField label="Email" value={session?.email} />
          <ReadOnlyField label="Department" value={isHr ? 'Human Resources' : '—'} />
          <ReadOnlyField label="Role" value={isHr ? 'Admin' : 'Employee'} />
        </div>

        <ProfileTabs tabs={tabs} defaultTab="personal" />
      </div>
    </DashboardLayout>
  )
}

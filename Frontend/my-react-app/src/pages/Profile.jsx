import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ProfileTabs from '../components/ProfileTabs'
import { ReadOnlyBlock, ReadOnlyField } from '../components/ReadOnlyField'
import { getSession } from '../api/auth'

export default function Profile() {
  const session = getSession()
  const isHr = session?.role === 'HR'

  const personalTab = {
    id: 'personal',
    label: 'Personal',
    content: (
      <div className="profile-tab-content">
        <div className="detail-grid">
          <ReadOnlyField label="Primary phone" value="9876543210" />
          <ReadOnlyField label="Email address" value={session?.email} />
          <ReadOnlyField label="Nationality" value="Indian" />
          <ReadOnlyField label="Gender" value="—" />
          <ReadOnlyField label="Date of birth" value="—" />
          <ReadOnlyField label="Marital status" value="—" />
          <ReadOnlyField label="Place of birth" value="—" />
          <ReadOnlyField label="Country of birth" value="India" />
        </div>
        <ReadOnlyBlock label="About" value="Profile details will sync from backend when connected." />
      </div>
    ),
  }

  const privateTab = {
    id: 'private',
    label: 'Private Info',
    content: (
      <div className="profile-tab-content">
        <p className="detail-hint">Sensitive information — view only.</p>
        <div className="detail-grid">
          <ReadOnlyField label="Father's name" value="—" />
          <ReadOnlyField label="Mother's name" value="—" />
          <ReadOnlyField label="Identity" value="—" />
          <ReadOnlyField label="Blood group" value="—" />
          <ReadOnlyField label="Address" value="—" />
        </div>
      </div>
    ),
  }

  const salaryTab = {
    id: 'salary',
    label: 'Salary Info',
    content: (
      <div className="profile-tab-content">
        <p className="detail-hint">Admin only — salary breakdown and deductions.</p>
        <div className="detail-grid">
          <ReadOnlyField label="Monthly wage" value="—" />
          <ReadOnlyField label="Yearly wage" value="—" />
          <ReadOnlyField label="Working days / month" value="—" />
          <ReadOnlyField label="Basic salary" value="—" />
          <ReadOnlyField label="HRA" value="—" />
          <ReadOnlyField label="Medical allowance" value="—" />
          <ReadOnlyField label="PF (employee)" value="—" />
          <ReadOnlyField label="Net salary" value="—" />
        </div>
      </div>
    ),
  }

  const securityTab = {
    id: 'security',
    label: 'Security',
    content: (
      <div className="profile-tab-content">
        <div className="detail-grid">
          <ReadOnlyField label="Login ID" value={session?.loginId} />
          <ReadOnlyField label="Last password change" value="—" />
          <ReadOnlyField label="Two-factor auth" value="Not enabled" />
        </div>
      </div>
    ),
  }

  const tabs = isHr
    ? [personalTab, privateTab, salaryTab, securityTab]
    : [personalTab, privateTab, securityTab]

  const initials = session?.email ? session.email[0].toUpperCase() : '?'

  return (
    <DashboardLayout>
      <Link to="/dashboard" className="detail-back">
        ← Back to Dashboard
      </Link>

      <div className="detail-card detail-card-wide">
        <div className="detail-header">
          <span className="detail-avatar">{initials}</span>
          <div className="detail-header-copy">
            <h1>My Profile</h1>
            <p>{session?.companyName ?? 'DayFlow'}</p>
            <span className="detail-status status-green">{isHr ? 'HR / Admin' : 'Employee'}</span>
          </div>
        </div>

        <div className="detail-grid profile-header-fields">
          <ReadOnlyField label="Emp ID" value={session?.loginId} />
          <ReadOnlyField label="Email" value={session?.email} />
          <ReadOnlyField label="Department" value={isHr ? 'Human Resources' : '—'} />
          <ReadOnlyField label="Phone" value="—" />
        </div>

        <ProfileTabs tabs={tabs} defaultTab="personal" />
      </div>
    </DashboardLayout>
  )
}

import { useState } from 'react'

export default function ProfileTabs({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  const current = tabs.find((t) => t.id === active)

  return (
    <div className="profile-tabs-wrap">
      <div className="profile-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={active === tab.id ? 'active' : undefined}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="profile-tab-panel" role="tabpanel">
        {current?.content}
      </div>
    </div>
  )
}

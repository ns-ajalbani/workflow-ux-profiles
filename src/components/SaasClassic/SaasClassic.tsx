import { useState } from 'react'
import './SaasClassic.css'

interface TabItem {
  id: string
  label: string
  description: string
}

const TABS: TabItem[] = [
  { id: 'google-drive', label: 'Google Drive', description: 'Cloud storage and file sync service by Google' },
  { id: 'gmail', label: 'Google Gmail', description: 'Email service by Google' },
  { id: 'onedrive', label: 'Microsoft 365 OneDrive', description: 'Cloud storage service by Microsoft' },
  { id: 'outlook', label: 'Microsoft 365 Outlook', description: 'Email and calendar service by Microsoft' },
  { id: 'sharepoint', label: 'Microsoft 365 SharePoint', description: 'Enterprise content management by Microsoft' },
  { id: 'salesforce', label: 'Salesforce', description: 'Customer relationship management platform' },
  { id: 'servicenow', label: 'ServiceNow', description: 'Workflow and IT service management platform' },
  { id: 'slack', label: 'Slack', description: 'Team communication and messaging platform' },
  { id: 'workplace', label: 'Workplace', description: 'Enterprise social networking platform by Facebook' },
]

export function SaasClassic() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const activeApp = TABS.find((tab) => tab.id === activeTab)

  return (
    <div className="saas-classic-page">
      <h1>SaaS (Classic)</h1>
      <div className="tabs-container">
        <div className="tabs-list">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeApp && (
          <div className="app-content">
            <h2>{activeApp.label}</h2>
            <p>{activeApp.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

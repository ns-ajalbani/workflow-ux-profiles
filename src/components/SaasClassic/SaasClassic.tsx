import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './SaasClassic.css'

interface TabItem {
  id: string
  label: string
  description: string
  logo: string
}

const GRAYSCALE_APPS = ['onedrive', 'outlook', 'sharepoint', 'workplace']

const TABS: TabItem[] = [
  { id: 'google-drive', label: 'Google Drive', description: 'Cloud storage and file sync service by Google', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/google.svg' },
  { id: 'gmail', label: 'Google Gmail', description: 'Email service by Google', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/gmail.svg' },
  { id: 'onedrive', label: 'Microsoft 365 OneDrive', description: 'Cloud storage service by Microsoft', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/onedrive.svg' },
  { id: 'outlook', label: 'Microsoft 365 Outlook', description: 'Email and calendar service by Microsoft', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/outlook.svg' },
  { id: 'sharepoint', label: 'Microsoft 365 SharePoint', description: 'Enterprise content management by Microsoft', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/sharepoint.svg' },
  { id: 'salesforce', label: 'Salesforce', description: 'Customer relationship management platform', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/salesforce.svg' },
  { id: 'servicenow', label: 'ServiceNow', description: 'Workflow and IT service management platform', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/servicenow.svg' },
  { id: 'slack', label: 'Slack', description: 'Team communication and messaging platform', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/slackenterprise.svg' },
  { id: 'workplace', label: 'Workplace', description: 'Enterprise social networking platform by Facebook', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/fbworkplace.svg' },
]

export function SaasClassic() {
  const navigate = useNavigate()
  const { appId } = useParams<{ appId: string }>()
  const [activeTab, setActiveTab] = useState(appId || TABS[0].id)
  const activeApp = TABS.find((tab) => tab.id === activeTab)

  useEffect(() => {
    if (appId) {
      setActiveTab(appId)
    }
  }, [appId])

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    navigate(`/saas-classic/${tabId}`)
  }

  return (
    <div className="saas-classic-page">
      <h1>SaaS (Classic)</h1>
      <div className="tabs-container">
        <div className="tabs-list">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <img
                src={tab.logo}
                alt={tab.label}
                className={`tab-icon ${GRAYSCALE_APPS.includes(tab.id) ? 'grayscale-logo' : ''}`}
              />
              {tab.label}
            </button>
          ))}
        </div>
        {activeApp && (
          <div className="app-content">
            <div className="app-header">
              <img
                src={activeApp.logo}
                alt={activeApp.label}
                className={`app-logo ${GRAYSCALE_APPS.includes(activeApp.id) ? 'grayscale-logo' : ''}`}
              />
              <h2>{activeApp.label}</h2>
            </div>
            <p>{activeApp.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

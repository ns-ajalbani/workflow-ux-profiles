import { useParams, useNavigate } from 'react-router-dom'
import './AppDetail.css'

const APP_DETAILS: Record<string, { name: string; description: string }> = {
  'google-drive': { name: 'Google Drive', description: 'Cloud storage and file sync service by Google' },
  'gmail': { name: 'Google Gmail', description: 'Email service by Google' },
  'onedrive': { name: 'Microsoft 365 OneDrive', description: 'Cloud storage service by Microsoft' },
  'outlook': { name: 'Microsoft 365 Outlook', description: 'Email and calendar service by Microsoft' },
  'sharepoint': { name: 'Microsoft 365 SharePoint', description: 'Enterprise content management by Microsoft' },
  'salesforce': { name: 'Salesforce', description: 'Customer relationship management platform' },
  'servicenow': { name: 'ServiceNow', description: 'Workflow and IT service management platform' },
  'slack': { name: 'Slack', description: 'Team communication and messaging platform' },
  'workplace': { name: 'Workplace', description: 'Enterprise social networking platform by Facebook' },
}

export function AppDetail() {
  const { appId } = useParams<{ appId: string }>()
  const navigate = useNavigate()

  const app = appId ? APP_DETAILS[appId] : null

  if (!app) {
    return (
      <div className="app-detail">
        <button onClick={() => navigate('/saas-classic')} className="back-button">
          ← Back to SaaS (Classic)
        </button>
        <p>App not found</p>
      </div>
    )
  }

  return (
    <div className="app-detail">
      <button onClick={() => navigate('/saas-classic')} className="back-button">
        ← Back to SaaS (Classic)
      </button>
      <h1>{app.name}</h1>
      <p>{app.description}</p>
    </div>
  )
}

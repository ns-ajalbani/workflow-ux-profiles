import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Highcharts from 'highcharts'
import './SaasClassic.css'

interface TabItem {
  id: string
  label: string
  description: string
  logo: string
  hasDashboard?: boolean
}

const GRAYSCALE_APPS = ['onedrive', 'outlook', 'sharepoint', 'workplace']

const INSTANCES: Record<string, string[]> = {
  'google-drive': ['autoskope.com', 'netskope.com', 'test.org', 'demo.net'],
}

function EventsAreaChart() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      Highcharts.chart(containerRef.current, {
        chart: {
          type: 'area',
          backgroundColor: 'transparent',
          borderWidth: 0,
          margin: [10, 20, 30, 40]
        },
        title: { text: null },
        xAxis: {
          type: 'datetime',
          labels: { enabled: false },
          lineWidth: 0,
          tickWidth: 0
        },
        yAxis: {
          title: { text: null },
          labels: { enabled: false },
          gridLineWidth: 0
        },
        legend: { enabled: false },
        plotOptions: {
          area: { fillOpacity: 0.2, marker: { enabled: false } }
        },
        series: [
          {
            type: 'area',
            name: 'Events',
            marker: { enabled: false },
            lineWidth: 0,
            data: [
              [Date.UTC(2024, 0, 1), 120],
              [Date.UTC(2024, 0, 2), 150],
              [Date.UTC(2024, 0, 3), 180],
              [Date.UTC(2024, 0, 4), 140],
              [Date.UTC(2024, 0, 5), 200],
              [Date.UTC(2024, 0, 6), 170],
              [Date.UTC(2024, 0, 7), 210],
              [Date.UTC(2024, 0, 8), 190],
              [Date.UTC(2024, 0, 9), 220],
              [Date.UTC(2024, 0, 10), 250],
              [Date.UTC(2024, 0, 11), 230],
              [Date.UTC(2024, 0, 12), 280],
              [Date.UTC(2024, 0, 13), 260],
              [Date.UTC(2024, 0, 14), 310]
            ],
            color: '#0066cc'
          }
        ],
        credits: { enabled: false }
      })
    }
  }, [])

  return <div className="events-chart-container" ref={containerRef}></div>
}

const TABS: TabItem[] = [
  { id: 'new-app', label: 'New App Instance', description: 'Create a new SaaS application instance', logo: '' },
  { id: 'google-drive', label: 'Google Drive', description: 'Cloud storage and file sync service by Google', logo: 'https://qa.goskope.com/UI_Layer/img/applications/for_dark_bg/google.svg', hasDashboard: true },
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
  const { appId, instanceName } = useParams<{ appId: string; instanceName?: string }>()
  const [activeTab, setActiveTab] = useState(appId || TABS[1].id)
  const activeApp = TABS.find((tab) => tab.id === activeTab)
  const defaultInstance = activeApp && INSTANCES[activeApp.id] ? INSTANCES[activeApp.id][0] : undefined
  const [activeInstance, setActiveInstance] = useState<string | undefined>(instanceName || defaultInstance)

  useEffect(() => {
    if (appId) {
      setActiveTab(appId)
    }
  }, [appId])

  useEffect(() => {
    if (instanceName) {
      setActiveInstance(instanceName)
    } else if (activeApp && INSTANCES[activeApp.id]) {
      const firstInstance = INSTANCES[activeApp.id][0]
      setActiveInstance(firstInstance)
      navigate(`/saas-classic/${activeApp.id}/${firstInstance}`)
    }
  }, [activeApp, instanceName, navigate])

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
              {tab.logo ? (
                <img
                  src={tab.logo}
                  alt={tab.label}
                  className={`tab-icon ${GRAYSCALE_APPS.includes(tab.id) ? 'grayscale-logo' : ''}`}
                />
              ) : (
                <span className="tab-icon plus-icon">+</span>
              )}
              {tab.label}
            </button>
          ))}
        </div>
        {activeApp && (
          <div className="app-content">
            <div className="header-section">
              <div>
                <div className="app-header">
                  {activeApp.logo && (
                    <img
                      src={activeApp.logo}
                      alt={activeApp.label}
                      className={`app-logo ${GRAYSCALE_APPS.includes(activeApp.id) ? 'grayscale-logo' : ''}`}
                    />
                  )}
                  <h2>{activeApp.label}</h2>
                </div>
                <p>{activeApp.description}</p>
              </div>
              <EventsAreaChart />
            </div>
            {activeApp.hasDashboard && INSTANCES[activeApp.id] && (
              <div className="app-with-sidebar">
                <div className="instances-sidebar">
                  <h3 className="sidebar-label">Instances</h3>
                  <ul className="instances-list">
                    {INSTANCES[activeApp.id].map((instance) => (
                      <li key={instance}>
                        <button
                          className={`instance-item ${activeInstance === instance ? 'active' : ''}`}
                          onClick={() => {
                            setActiveInstance(instance)
                            navigate(`/saas-classic/${activeApp.id}/${instance}`)
                          }}
                        >
                          {instance}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dashboard">
                  <div className="dashboard-header">
                    {activeInstance && <h3 className="instance-name">{activeInstance}</h3>}
                  </div>
                  <h4 className="section-title">Files</h4>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-value">1,234</div>
                      <div className="metric-label">Total Files</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">892</div>
                      <div className="metric-label">Shared Files</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">45.2 GB</div>
                      <div className="metric-label">Storage Used</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">18</div>
                      <div className="metric-label">Active Users</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">156</div>
                      <div className="metric-label">Last 24h Events</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">3</div>
                      <div className="metric-label">Alerts</div>
                    </div>
                  </div>

                  <div className="charts-section">
                    <div className="chart-container">
                      <h4 className="chart-title">File Exposure</h4>
                      <div className="pie-chart">
                        <svg viewBox="0 0 160 160" className="pie-svg">
                          <circle cx="80" cy="80" r="60" fill="none" stroke="#0066cc" strokeWidth="18" strokeDasharray="294 471" transform="rotate(-90 80 80)" />
                          <circle cx="80" cy="80" r="60" fill="none" stroke="#ff6b35" strokeWidth="18" strokeDasharray="117.6 471" strokeDashoffset="-294" transform="rotate(-90 80 80)" />
                          <circle cx="80" cy="80" r="60" fill="none" stroke="#00a86b" strokeWidth="18" strokeDasharray="59.4 471" strokeDashoffset="-411.6" transform="rotate(-90 80 80)" />
                        </svg>
                        <div className="pie-center">1260.6k</div>
                      </div>
                      <div className="chart-legend">
                        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#0066cc'}}></span>Private</div>
                        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#ff6b35'}}></span>External</div>
                        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#00a86b'}}></span>Enterprise</div>
                      </div>
                    </div>

                    <div className="chart-container">
                      <h4 className="chart-title">File Types</h4>
                      <div className="bar-chart">
                        <div className="bar-item">
                          <div className="bar-label">Container Files</div>
                          <div className="bar-wrapper">
                            <div className="bar" style={{width: '85%'}}></div>
                            <span className="bar-value">684.4K</span>
                          </div>
                        </div>
                        <div className="bar-item">
                          <div className="bar-label">Documents</div>
                          <div className="bar-wrapper">
                            <div className="bar" style={{width: '38%'}}></div>
                            <span className="bar-value">320.2K</span>
                          </div>
                        </div>
                        <div className="bar-item">
                          <div className="bar-label">Folder</div>
                          <div className="bar-wrapper">
                            <div className="bar" style={{width: '32%'}}></div>
                            <span className="bar-value">264.4K</span>
                          </div>
                        </div>
                        <div className="bar-item">
                          <div className="bar-label">Text Files</div>
                          <div className="bar-wrapper">
                            <div className="bar" style={{width: '17%'}}></div>
                            <span className="bar-value">110.4K</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ecosystem-section">
                    <h4 className="section-title">Users, Team Drives & Google Ecosystem</h4>
                    <div className="info-cards">
                      <div className="info-card">
                        <div className="card-icon">👤</div>
                        <div className="card-content">
                          <div className="card-stat">
                            <span className="stat-label">INTERNAL USERS</span>
                            <span className="stat-value">2,588</span>
                          </div>
                          <div className="card-stat">
                            <span className="stat-label">EXTERNAL USERS</span>
                            <span className="stat-value">21</span>
                          </div>
                        </div>
                      </div>
                      <div className="info-card">
                        <div className="card-icon">👥</div>
                        <div className="card-content">
                          <div className="card-stat">
                            <span className="stat-label">TOTAL TEAM DRIVES</span>
                            <span className="stat-value">7,642</span>
                          </div>
                          <div className="card-stat">
                            <span className="stat-label">HAS EXTERNAL USERS</span>
                            <span className="stat-value" style={{color: '#e53e3e'}}>2</span>
                          </div>
                        </div>
                      </div>
                      <div className="info-card">
                        <div className="card-icon">⬜</div>
                        <div className="card-content">
                          <div className="card-stat">
                            <span className="stat-label">APPS</span>
                            <span className="stat-value">16</span>
                          </div>
                          <div className="card-stat">
                            <span className="stat-label">PLUG-INS</span>
                            <span className="stat-value" style={{color: '#e53e3e'}}>7</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sub-section-grid">
                      <div className="sub-section">
                        <h5 className="sub-section-title">Sub Domains Internally Shared</h5>
                        <div className="domain-bars">
                          <div className="domain-bar-item">
                            <span className="domain-name">autoskope.com</span>
                            <div className="domain-bar-wrapper">
                              <div className="domain-bar" style={{width: '95%'}}></div>
                              <span className="domain-bar-value">2,587</span>
                            </div>
                          </div>
                          <div className="domain-bar-item">
                            <span className="domain-name">sub.autoskope.com</span>
                            <div className="domain-bar-wrapper">
                              <div className="domain-bar" style={{width: '5%'}}></div>
                              <span className="domain-bar-value">1</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="sub-section">
                        <h5 className="sub-section-title">Apps/Plug-ins Scope</h5>
                        <div className="app-bars">
                          <div className="app-bar-item">
                            <span className="app-name">openid</span>
                            <div className="app-bar-wrapper">
                              <div className="app-bar" style={{width: '31%'}}></div>
                              <span className="app-bar-value">8</span>
                            </div>
                          </div>
                          <div className="app-bar-item">
                            <span className="app-name">G+ Domains View Email Add</span>
                            <div className="app-bar-wrapper">
                              <div className="app-bar" style={{width: '31%'}}></div>
                              <span className="app-bar-value">8</span>
                            </div>
                          </div>
                          <div className="app-bar-item">
                            <span className="app-name">G+ Domains View Basic Profile</span>
                            <div className="app-bar-wrapper">
                              <div className="app-bar" style={{width: '31%'}}></div>
                              <span className="app-bar-value">8</span>
                            </div>
                          </div>
                          <div className="app-bar-item">
                            <span className="app-name">Deprecated API</span>
                            <div className="app-bar-wrapper">
                              <div className="app-bar" style={{width: '15%'}}></div>
                              <span className="app-bar-value">4</span>
                            </div>
                          </div>
                          <div className="app-bar-item">
                            <span className="app-name">Drive View Files</span>
                            <div className="app-bar-wrapper">
                              <div className="app-bar" style={{width: '8%'}}></div>
                              <span className="app-bar-value">2</span>
                            </div>
                          </div>
                          <div className="app-bar-item">
                            <span className="app-name">All Others</span>
                            <div className="app-bar-wrapper">
                              <div className="app-bar" style={{width: '100%'}}></div>
                              <span className="app-bar-value">26</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

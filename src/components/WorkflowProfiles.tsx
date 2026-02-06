import { useState } from 'react'
import './WorkflowProfiles.css'

interface WorkflowProfile {
  id: string
  name: string
  description: string
  steps: number
  isActive: boolean
}

interface WorkflowProfilesProps {
  onSelectProfile?: (profile: WorkflowProfile) => void
}

export default function WorkflowProfiles({ onSelectProfile }: WorkflowProfilesProps) {
  const [profiles, setProfiles] = useState<WorkflowProfile[]>([
    {
      id: '1',
      name: 'Quick Approval',
      description: 'Fast-track approval workflow for simple tasks',
      steps: 3,
      isActive: true,
    },
    {
      id: '2',
      name: 'Standard Review',
      description: 'Standard workflow with manager and team review',
      steps: 5,
      isActive: false,
    },
    {
      id: '3',
      name: 'Executive Sign-off',
      description: 'High-level approval workflow with executive review',
      steps: 7,
      isActive: false,
    },
    {
      id: '4',
      name: 'Custom Process',
      description: 'Customizable workflow for special cases',
      steps: 4,
      isActive: false,
    },
  ])

  const handleSelectProfile = (profile: WorkflowProfile) => {
    setProfiles(
      profiles.map(p => ({
        ...p,
        isActive: p.id === profile.id,
      }))
    )
    onSelectProfile?.(profile)
  }

  return (
    <div className="workflow-profiles">
      <div className="profiles-header">
        <h2>Workflow Profiles</h2>
        <p className="profiles-description">Select a workflow profile to define your approval process</p>
      </div>

      <div className="profiles-grid">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className={`profile-card ${profile.isActive ? 'active' : ''}`}
            onClick={() => handleSelectProfile(profile)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSelectProfile(profile)
              }
            }}
          >
            <div className="profile-header">
              <h3>{profile.name}</h3>
              {profile.isActive && <span className="active-badge">Active</span>}
            </div>
            <p className="profile-description">{profile.description}</p>
            <div className="profile-footer">
              <span className="step-count">{profile.steps} steps</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import type { Profile } from '../Profiles'

interface SidePanelHeaderProps {
  editingProfile?: Profile | null
  onClose: () => void
}

export function SidePanelHeader({ editingProfile, onClose }: SidePanelHeaderProps) {
  return (
    <div className="side-panel-header">
      <h2>{editingProfile ? 'Edit Profile' : 'Create New Profile'}</h2>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  )
}

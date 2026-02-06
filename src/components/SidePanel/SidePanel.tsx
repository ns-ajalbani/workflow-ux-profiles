import { useState, useEffect } from 'react'
import profileTypesData from '../../data/profileTypes.json'
import { TYPE_ICONS, TYPE_COLORS, SUBTYPE_ICONS } from '../typeConfig'
import FingerprintRulesForm from '../forms/FingerprintRulesForm'
import MalwareDetectionForm from '../forms/MalwareDetectionForm'
import DestinationForm from '../forms/DestinationForm'
import UrlListsForm from '../forms/UrlListsForm'
import CustomCategoriesForm from '../forms/CustomCategoriesForm'
import type { Profile } from '../Profiles'

const TYPE_TOOLTIPS: Record<string, string> = {
  DLP: 'Protect sensitive data from unauthorized access, sharing, or exfiltration across cloud and web channels.',
  'Threat Protection':
    'Detect and block malware, ransomware, and other threats in real-time across all traffic.',
  'Custom Categories':
    'Create custom URL categories to define granular web access policies for your organization.',
  'URL Lists':
    'Maintain lists of URLs and IP addresses to allow or block specific web destinations.',
  Destination:
    'Define destination profiles using domains, URLs, IP addresses, and CIDR ranges for policy targeting.',
  'App Instance':
    'Distinguish between corporate and personal instances of cloud applications.',
  'HTTP Header':
    'Add or modify HTTP headers to enforce tenant restrictions and access controls.',
  Domain: 'Define domain-based policies for controlling access to specific web domains.',
  User: 'Create user-based profiles to apply policies based on user identity and group membership.',
  File: 'Define file-based policies to control uploads, downloads, and sharing of specific file types.',
  Constraint:
    'Set behavioral constraints such as activity restrictions and data movement controls.',
  Quarantine:
    'Isolate suspicious files and content for review before allowing access to end users.',
  'Legal Hold':
    'Preserve and retain content for compliance, legal discovery, and regulatory requirements.',
  Forensic:
    'Capture detailed forensic data for security investigations and incident response.',
  'Network Location':
    'Define network locations to apply different policies based on user network context.',
  'Connected App/Plugin':
    'Manage third-party apps and plugins connected to your sanctioned cloud services.',
}

type CreationStep = 'type' | 'subtype' | 'configure'

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToProfile: (type: string) => void
  editingProfile?: Profile | null
}

export default function SidePanel({ isOpen, onClose, onNavigateToProfile, editingProfile }: SidePanelProps) {
  const [creationStep, setCreationStep] = useState<CreationStep>('type')
  const [selectedProfileType, setSelectedProfileType] = useState<string>('')
  const [selectedProfileSubtype, setSelectedProfileSubtype] = useState<string>('')
  const [profileName, setProfileName] = useState<string>('')

  const currentTypeObject = profileTypesData.profileTypes.find(t => t.name === selectedProfileType)
  const availableSubtypes = currentTypeObject?.subtypes || []

  useEffect(() => {
    if (editingProfile && isOpen) {
      setSelectedProfileType(editingProfile.type)
      setSelectedProfileSubtype(editingProfile.subtype)
      setProfileName(editingProfile.name)
      setCreationStep('configure')
    } else if (isOpen) {
      setCreationStep('type')
      setSelectedProfileType('')
      setSelectedProfileSubtype('')
      setProfileName('')
    }
  }, [isOpen, editingProfile])

  const handleClose = () => {
    setCreationStep('type')
    setSelectedProfileType('')
    setSelectedProfileSubtype('')
    setProfileName('')
    onClose()
  }

  const handleSelectType = (typeName: string) => {
    setSelectedProfileType(typeName)
    const typeObj = profileTypesData.profileTypes.find(t => t.name === typeName)

    if (typeObj?.subtypes.length === 1 && typeObj.subtypes[0] === 'N/A') {
      setSelectedProfileSubtype('N/A')
      setCreationStep('configure')
    } else {
      setCreationStep('subtype')
    }
  }

  const handleSelectSubtype = (subtype: string) => {
    setSelectedProfileSubtype(subtype)
    setCreationStep('configure')
  }

  const handleBackStep = () => {
    if (creationStep === 'subtype') {
      setCreationStep('type')
      setSelectedProfileType('')
      setSelectedProfileSubtype('')
    } else if (creationStep === 'configure') {
      const typeObj = profileTypesData.profileTypes.find(t => t.name === selectedProfileType)
      if (typeObj?.subtypes.length === 1 && typeObj.subtypes[0] === 'N/A') {
        setCreationStep('type')
        setSelectedProfileType('')
        setSelectedProfileSubtype('')
      } else {
        setCreationStep('subtype')
        setSelectedProfileSubtype('')
      }
    }
  }

  const handleFormSubmit = () => {
    handleClose()
  }

  return (
    <>
      {isOpen && (
        <div
          className="side-panel-overlay"
          role="button"
          tabIndex={0}
          aria-label="Close panel"
          onClick={handleClose}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleClose()
          }}
        />
      )}

      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="side-panel-header">
          <h3>{editingProfile ? 'Edit Profile' : 'Create New Profile'}</h3>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="side-panel-content">
          {creationStep === 'type' && (
            <div className="step-content">
              <p className="step-description">Select a profile type:</p>
              <div className="type-options">
                {profileTypesData.profileTypes.map(profileType => (
                  <button
                    key={profileType.id}
                    className="type-option"
                    style={{
                      borderLeftColor: TYPE_COLORS[profileType.name]?.color || 'transparent',
                    }}
                    onClick={() => handleSelectType(profileType.name)}
                  >
                    <div className="option-header">
                      <span
                        className="option-icon"
                        style={{
                          color: TYPE_COLORS[profileType.name]?.color || '#555',
                          background: TYPE_COLORS[profileType.name]?.bg || '#f5f5f5',
                        }}
                      >
                        {TYPE_ICONS[profileType.name]}
                      </span>
                      <div className="option-text">
                        <span className="option-name">{profileType.name}</span>
                        <span className="option-description">
                          {TYPE_TOOLTIPS[profileType.name] || profileType.description}
                        </span>
                      </div>
                      <span className="option-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {creationStep === 'subtype' && currentTypeObject && (
            <div className="step-content">
              <button className="back-btn" onClick={handleBackStep}>
                ← Back
              </button>
              <p className="step-title">
                Profile Type: <strong>{selectedProfileType}</strong>
              </p>
              <p className="step-description">Select a subtype:</p>
              <div className="subtype-options">
                {availableSubtypes.map(subtype => (
                  <button
                    key={subtype}
                    className="subtype-option"
                    onClick={() => handleSelectSubtype(subtype)}
                  >
                    {SUBTYPE_ICONS[subtype] && (
                      <span
                        className="subtype-icon"
                        style={{
                          color: TYPE_COLORS[selectedProfileType]?.color || '#555',
                        }}
                      >
                        {SUBTYPE_ICONS[subtype]}
                      </span>
                    )}
                    <span className="subtype-label">{subtype}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {creationStep === 'configure' && (
            <div className="step-content">
              {!editingProfile && (
                <button className="back-btn" onClick={handleBackStep}>
                  ← Back
                </button>
              )}
              <div
                className="profile-info-bar"
                style={{
                  borderLeftColor: TYPE_COLORS[selectedProfileType]?.color || '#0066cc',
                }}
              >
                <span
                  className="profile-info-icon"
                  style={{ color: TYPE_COLORS[selectedProfileType]?.color || '#555' }}
                >
                  {TYPE_ICONS[selectedProfileType]}
                </span>
                <span className="profile-info-text">
                  <span className="profile-info-type">{selectedProfileType}</span>
                  {selectedProfileSubtype !== 'N/A' && (
                    <>
                      <span className="profile-info-sep">/</span>
                      {SUBTYPE_ICONS[selectedProfileSubtype] && (
                        <span
                          className="profile-info-subtype-icon"
                          style={{ color: TYPE_COLORS[selectedProfileType]?.color || '#555' }}
                        >
                          {SUBTYPE_ICONS[selectedProfileSubtype]}
                        </span>
                      )}
                      <span className="profile-info-subtype">{selectedProfileSubtype}</span>
                    </>
                  )}
                </span>
              </div>

              {selectedProfileType === 'DLP' && selectedProfileSubtype === 'Fingerprint Rules' && (
                <FingerprintRulesForm onSubmit={handleFormSubmit} profileName={profileName} isEditing={!!editingProfile} />
              )}

              {selectedProfileType === 'Threat Protection' &&
                selectedProfileSubtype === 'Malware Detection' && (
                  <MalwareDetectionForm onSubmit={handleFormSubmit} profileName={profileName} isEditing={!!editingProfile} />
                )}

              {selectedProfileType === 'Destination' && (
                <DestinationForm subtype={selectedProfileSubtype} onSubmit={handleFormSubmit} profileName={profileName} isEditing={!!editingProfile} />
              )}

              {selectedProfileType === 'URL Lists' && <UrlListsForm onSubmit={handleFormSubmit} profileName={profileName} isEditing={!!editingProfile} />}

              {selectedProfileType === 'Custom Categories' && (
                <CustomCategoriesForm
                  onNavigateToProfile={onNavigateToProfile}
                  onSubmit={handleFormSubmit}
                  profileName={profileName}
                  isEditing={!!editingProfile}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

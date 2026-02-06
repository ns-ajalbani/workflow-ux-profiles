import { useState } from 'react'
import profileTypesData from '../../data/profileTypes.json'
import { TYPE_ICONS, TYPE_COLORS } from '../typeConfig'
import FingerprintRulesForm from '../forms/FingerprintRulesForm'
import MalwareDetectionForm from '../forms/MalwareDetectionForm'
import DestinationForm from '../forms/DestinationForm'
import UrlListsForm from '../forms/UrlListsForm'
import CustomCategoriesForm from '../forms/CustomCategoriesForm'

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

type CreationStep = 'type' | 'subtype' | 'complete' | 'configure'

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToProfile: (type: string) => void
}

export default function SidePanel({ isOpen, onClose, onNavigateToProfile }: SidePanelProps) {
  const [creationStep, setCreationStep] = useState<CreationStep>('type')
  const [selectedProfileType, setSelectedProfileType] = useState<string>('')
  const [selectedProfileSubtype, setSelectedProfileSubtype] = useState<string>('')

  const currentTypeObject = profileTypesData.profileTypes.find(t => t.name === selectedProfileType)
  const availableSubtypes = currentTypeObject?.subtypes || []

  const handleClose = () => {
    setCreationStep('type')
    setSelectedProfileType('')
    setSelectedProfileSubtype('')
    onClose()
  }

  const handleSelectType = (typeName: string) => {
    setSelectedProfileType(typeName)
    const typeObj = profileTypesData.profileTypes.find(t => t.name === typeName)

    if (typeObj?.subtypes.length === 1 && typeObj.subtypes[0] === 'N/A') {
      setSelectedProfileSubtype('N/A')
      setCreationStep('complete')
    } else {
      setCreationStep('subtype')
    }
  }

  const handleSelectSubtype = (subtype: string) => {
    setSelectedProfileSubtype(subtype)
    setCreationStep('complete')
  }

  const handleNextToConfiguration = () => {
    if (selectedProfileType && selectedProfileSubtype) {
      setCreationStep('configure')
    }
  }

  const handleBackStep = () => {
    if (creationStep === 'subtype') {
      setCreationStep('type')
      setSelectedProfileType('')
      setSelectedProfileSubtype('')
    } else if (creationStep === 'complete') {
      setCreationStep('subtype')
    } else if (creationStep === 'configure') {
      setCreationStep('complete')
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
          <h3>Create New Profile</h3>
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
                    onClick={() => handleSelectType(profileType.name)}
                  >
                    <div className="option-header">
                      <span
                        className="option-icon"
                        style={{
                          color: TYPE_COLORS[profileType.name]?.color || '#555',
                        }}
                      >
                        {TYPE_ICONS[profileType.name]}
                      </span>
                      <span className="option-name">{profileType.name}</span>
                      <span className="option-info-wrapper">
                        <span className="option-info-icon">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        </span>
                        <span className="option-tooltip">
                          {TYPE_TOOLTIPS[profileType.name] || profileType.description}
                        </span>
                      </span>
                    </div>
                    <div className="option-description">{profileType.description}</div>
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
                    {subtype}
                  </button>
                ))}
              </div>
            </div>
          )}

          {creationStep === 'complete' && (
            <div className="step-content">
              <button className="back-btn" onClick={handleBackStep}>
                ← Back
              </button>
              <div className="profile-info">
                <p className="info-label">
                  Profile Type: <strong>{selectedProfileType}</strong>
                </p>
                <p className="info-label">
                  Subtype: <strong>{selectedProfileSubtype}</strong>
                </p>
              </div>
              <button className="create-btn" onClick={handleNextToConfiguration}>
                Next
              </button>
            </div>
          )}

          {creationStep === 'configure' && (
            <div className="step-content">
              <button className="back-btn" onClick={handleBackStep}>
                ← Back
              </button>
              <div className="profile-info">
                <p className="info-label">
                  Profile Type: <strong>{selectedProfileType}</strong>
                </p>
                {selectedProfileSubtype !== 'N/A' && (
                  <p className="info-label">
                    Subtype: <strong>{selectedProfileSubtype}</strong>
                  </p>
                )}
              </div>

              {selectedProfileType === 'DLP' && selectedProfileSubtype === 'Fingerprint Rules' && (
                <FingerprintRulesForm onSubmit={handleFormSubmit} />
              )}

              {selectedProfileType === 'Threat Protection' &&
                selectedProfileSubtype === 'Malware Detection' && (
                  <MalwareDetectionForm onSubmit={handleFormSubmit} />
                )}

              {selectedProfileType === 'Destination' && (
                <DestinationForm subtype={selectedProfileSubtype} onSubmit={handleFormSubmit} />
              )}

              {selectedProfileType === 'URL Lists' && <UrlListsForm onSubmit={handleFormSubmit} />}

              {selectedProfileType === 'Custom Categories' && (
                <CustomCategoriesForm
                  onNavigateToProfile={onNavigateToProfile}
                  onSubmit={handleFormSubmit}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

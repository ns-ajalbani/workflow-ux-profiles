import { useState } from 'react'
import profileTypesData from '../data/profileTypes.json'
import FingerprintRulesForm from './forms/FingerprintRulesForm'
import MalwareDetectionForm from './forms/MalwareDetectionForm'
import UrlListsForm from './forms/UrlListsForm'
import CustomCategoriesForm from './forms/CustomCategoriesForm'

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
                    <div className="option-name">{profileType.name}</div>
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

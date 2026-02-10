import { useState, useEffect } from 'react'
import profileTypesData from '../../data/profileTypes.json'
import { TYPE_COLORS, TYPE_ICONS, SUBTYPE_ICONS } from '../typeConfig'
import { SidePanelHeader } from './SidePanelHeader'
import { TypeSelectionStep } from './TypeSelectionStep'
import { SubtypeSelectionStep } from './SubtypeSelectionStep'
import { ProfileFormFactory } from './ProfileFormFactory'
import type { Profile } from '../Profiles'

type CreationStep = 'type' | 'subtype' | 'configure'

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToProfile: (type: string) => void
  editingProfile?: Profile | null
}

export default function SidePanel({
  isOpen,
  onClose,
  onNavigateToProfile,
  editingProfile,
}: SidePanelProps) {
  const [creationStep, setCreationStep] = useState<CreationStep>('type')
  const [selectedProfileType, setSelectedProfileType] = useState<string>('')
  const [selectedProfileSubtype, setSelectedProfileSubtype] = useState<string>('')
  const [profileName, setProfileName] = useState<string>('')

  const currentTypeObject = profileTypesData.profileTypes.find(t => t.name === selectedProfileType)

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
        <SidePanelHeader editingProfile={editingProfile} onClose={handleClose} />

        <div className="side-panel-content">
          {creationStep === 'type' && (
            <TypeSelectionStep selectedType={selectedProfileType} onSelectType={handleSelectType} />
          )}

          {creationStep === 'subtype' && currentTypeObject && (
            <SubtypeSelectionStep
              selectedType={selectedProfileType}
              selectedSubtype={selectedProfileSubtype}
              onSelectSubtype={handleSelectSubtype}
              onBack={handleBackStep}
            />
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

              {ProfileFormFactory({
                subtype: selectedProfileSubtype,
                profileName,
                selectedProfileType,
                editingProfile,
                onNavigateToProfile,
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

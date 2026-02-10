import profileTypesData from '../../data/profileTypes.json'
import { SUBTYPE_ICONS } from '../typeConfig'

interface SubtypeSelectionStepProps {
  selectedType: string
  selectedSubtype: string
  onSelectSubtype: (subtype: string) => void
  onBack: () => void
}

export function SubtypeSelectionStep({
  selectedType,
  selectedSubtype,
  onSelectSubtype,
  onBack,
}: SubtypeSelectionStepProps) {
  const currentTypeObject = profileTypesData.profileTypes.find(t => t.name === selectedType)
  const availableSubtypes = currentTypeObject?.subtypes || []

  return (
    <div className="step-content">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <p className="step-description">Choose a subtype for {selectedType}</p>
      <p className="step-title">Select Subtype</p>
      <div className="subtype-options">
        {availableSubtypes.map(subtype => (
          <button
            key={subtype}
            className={`subtype-option ${selectedSubtype === subtype ? 'selected' : ''}`}
            onClick={() => onSelectSubtype(subtype)}
          >
            <div className="subtype-icon">{SUBTYPE_ICONS[subtype] || '▪'}</div>
            <div className="subtype-label">{subtype}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

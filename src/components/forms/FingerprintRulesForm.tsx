import { useState } from 'react'

interface FingerprintRulesFormProps {
  onSubmit: () => void
}

export default function FingerprintRulesForm({ onSubmit }: FingerprintRulesFormProps) {
  const [ruleName, setRuleName] = useState('')
  const [threshold, setThreshold] = useState(70)

  const handleSubmit = () => {
    if (ruleName.trim()) {
      console.log('Creating fingerprint rule:', { ruleName, threshold })
      alert(`Profile created!\nRule Name: ${ruleName}\nThreshold: ${threshold}%`)
      onSubmit()
    }
  }

  return (
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="rule-name">Rule Name</label>
        <input
          id="rule-name"
          type="text"
          placeholder="Enter rule name"
          value={ruleName}
          onChange={e => setRuleName(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="threshold">Threshold ({threshold}%)</label>
        <div className="threshold-info">
          <span>70%</span>
          <input
            id="threshold"
            type="range"
            min="70"
            max="100"
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className="threshold-slider"
            style={{ '--value': threshold } as React.CSSProperties}
          />
          <span>100%</span>
        </div>
        <p className="threshold-help">
          The recommended default is 70%. Higher values mean stricter matching, while lower values
          may generate false positives.
        </p>
      </div>

      <button className="create-btn" onClick={handleSubmit} disabled={!ruleName.trim()}>
        Create Profile
      </button>
    </div>
  )
}

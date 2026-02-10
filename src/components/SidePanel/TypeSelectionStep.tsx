import profileTypesData from '../../data/profileTypes.json'
import { TYPE_ICONS } from '../typeConfig'

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

interface TypeSelectionStepProps {
  selectedType: string
  onSelectType: (type: string) => void
}

export function TypeSelectionStep({ selectedType, onSelectType }: TypeSelectionStepProps) {
  return (
    <div className="step-content">
      <p className="step-description">What type of profile do you want to create?</p>
      <p className="step-title">Select Profile Type</p>
      <div className="type-options">
        {profileTypesData.profileTypes.map(type => (
          <button
            key={type.id}
            className={`type-option ${selectedType === type.name ? 'selected' : ''}`}
            onClick={() => onSelectType(type.name)}
            title={TYPE_TOOLTIPS[type.name] || type.name}
          >
            <div className="option-header">
              <div className="option-icon">
                {TYPE_ICONS[type.name] || '📋'}
              </div>
              <div className="option-text">
                <div className="option-name">{type.name}</div>
                <div className="option-description">
                  {TYPE_TOOLTIPS[type.name] || 'Create a new profile'}
                </div>
              </div>
              <div className="option-chevron">›</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import './MatchLogic.css'

export interface MatchRule {
  id: string
  operator: 'OR' | 'AND NOT'
  field: string
  selectedValues: string[]
}

interface MatchLogicProps {
  onRulesChange?: (rules: MatchRule[]) => void
  onNavigateToProfile?: (type: string) => void
}

const CATEGORY_OPTIONS = [
  'Abortion',
  'Adult Content - Other',
  'Adult Content - Pornography',
  'Advocacy Groups & Trade Associations',
  'Aggressive',
  'Alcohol',
  'App Admin Console',
  'Application Suite',
  'Automotive',
  'Business Services',
  'CDN',
  'Computer & Internet Info',
  'Computers & Software',
  'Content Delivery Networks',
  'Dating',
  'Design Services',
  'Educational Institutions',
]

const DESTINATION_PROFILES = [
  'AWS Production',
  'Azure Cloud',
  'Google Cloud',
  'On-Premise Exchange',
  'Hybrid Cloud Setup',
]

const URL_LISTS = [
  'test_policy_weburl1688994225',
  'test_policy_weburl1688994300',
  'test_policy_weburl1689057059',
  'test_policy_weburl1689225366',
  'test_policy_weburl1689318935',
  'test_policy_weburl1689568717',
]

interface ProfileOption {
  name: string
  type: string
}

const URL_PROFILE_OPTIONS: ProfileOption[] = [
  ...DESTINATION_PROFILES.map(p => ({ name: p, type: 'Destination' })),
  ...URL_LISTS.map(p => ({ name: p, type: 'URL List' })),
]

export default function MatchLogic({ onRulesChange, onNavigateToProfile }: MatchLogicProps) {
  const [rules, setRules] = useState<MatchRule[]>([
    { id: '1', operator: 'OR', field: 'Category', selectedValues: [] },
    { id: '2', operator: 'OR', field: 'URL/Destination Profile', selectedValues: [] },
    { id: '3', operator: 'AND NOT', field: 'URL/Destination Profile', selectedValues: [] },
  ])

  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['Destination Profiles', 'URL Lists (to be deprecated)', 'Categories']),
  )

  const handleRuleChange = (id: string, field: 'operator' | 'field', newValue: string) => {
    const updatedRules = rules.map(rule =>
      rule.id === id ? { ...rule, [field]: newValue, selectedValues: [] } : rule,
    )
    setRules(updatedRules)
    onRulesChange?.(updatedRules)
  }

  const handleValueToggle = (ruleId: string, value: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        const isSelected = rule.selectedValues.includes(value)
        return {
          ...rule,
          selectedValues: isSelected
            ? rule.selectedValues.filter(v => v !== value)
            : [...rule.selectedValues, value],
        }
      }
      return rule
    })
    setRules(updatedRules)
    onRulesChange?.(updatedRules)
  }

  const handleSelectAll = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return

    let allOptions: string[] = []
    if (rule.field === 'Category') {
      allOptions = CATEGORY_OPTIONS
    } else {
      allOptions = URL_PROFILE_OPTIONS.map((o: ProfileOption) => o.name)
    }

    const updatedRules = rules.map(r => {
      if (r.id === ruleId) {
        return {
          ...r,
          selectedValues: r.selectedValues.length === allOptions.length ? [] : [...allOptions],
        }
      }
      return r
    })
    setRules(updatedRules)
    onRulesChange?.(updatedRules)
  }

  const handleAddRule = () => {
    const newId = String(Math.max(...rules.map(r => parseInt(r.id)), 0) + 1)
    const newRule: MatchRule = {
      id: newId,
      operator: 'OR',
      field: 'Category',
      selectedValues: [],
    }
    const updatedRules = [...rules, newRule]
    setRules(updatedRules)
    onRulesChange?.(updatedRules)
  }

  const handleRemoveRule = (id: string) => {
    if (rules.length > 1) {
      const updatedRules = rules.filter(rule => rule.id !== id)
      setRules(updatedRules)
      onRulesChange?.(updatedRules)
    }
  }

  const getOptions = (field: string) => {
    if (field === 'Category') {
      return CATEGORY_OPTIONS.map(name => ({ name, type: 'Category' }))
    }
    return URL_PROFILE_OPTIONS
  }

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  const getGroupedOptions = (field: string) => {
    const options = getOptions(field)
    if (field === 'Category') {
      return [{ group: 'Categories', items: options }]
    }

    return [
      {
        group: 'Destination Profiles',
        items: options.filter((o: ProfileOption) => o.type === 'Destination'),
      },
      {
        group: 'URL Lists (to be deprecated)',
        items: options.filter((o: ProfileOption) => o.type === 'URL List'),
      },
    ]
  }

  return (
    <div className="match-logic">
      <div className="match-logic-header">
        <span className="definition-label">Definition</span>
        <p className="definition-help">
          Define matching rules using AND/OR operators. The OR operator is applied to multiple
          selections within a single criterion.
        </p>
      </div>

      <div className="rules-container">
        {rules.map((rule, index) => {
          const options = getOptions(rule.field)
          const isExpanded = expandedRuleId === rule.id

          return (
            <div key={rule.id} className="rule-section">
              <div className="rule-row">
                <div className="operator-cell">
                  {index === 0 ? (
                    <div className="operator-badge">{rule.operator}</div>
                  ) : (
                    <select
                      value={rule.operator}
                      onChange={e => handleRuleChange(rule.id, 'operator', e.target.value)}
                      className="operator-select"
                    >
                      <option value="OR">OR</option>
                      <option value="AND NOT">AND NOT</option>
                    </select>
                  )}
                </div>

                <div className="rule-content">
                  <div className="field-label">{rule.field} =</div>
                  <button
                    className="rule-value-btn"
                    onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}
                  >
                    {rule.selectedValues.length > 0 ? (
                      <span className="selected-count">{rule.selectedValues.length} selected</span>
                    ) : (
                      <span className="select-placeholder">Select</span>
                    )}
                    <span className={`toggle-arrow ${isExpanded ? 'open' : ''}`}>▼</span>
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemoveRule(rule.id)}
                  disabled={rules.length === 1}
                  title={rules.length === 1 ? 'Cannot remove the last rule' : 'Remove rule'}
                >
                  ✕
                </button>
              </div>

              {isExpanded && (
                <div className="rule-dropdown">
                  <div className="dropdown-header">
                    <label className="select-all-checkbox">
                      <input
                        type="checkbox"
                        checked={rule.selectedValues.length === options.length}
                        onChange={() => handleSelectAll(rule.id)}
                      />
                      <span>Select All ({options.length})</span>
                    </label>
                  </div>

                  <div className="dropdown-search">
                    <input
                      type="text"
                      placeholder={`Search for ${rule.field.toLowerCase()}`}
                      className="search-input"
                    />
                  </div>

                  <div className="dropdown-options">
                    {getGroupedOptions(rule.field).map(group => (
                      <div key={group.group} className="option-group">
                        <div className="group-header">
                          <span
                            role="button"
                            tabIndex={0}
                            className={`group-arrow ${expandedGroups.has(group.group) ? 'open' : ''}`}
                            onClick={() => toggleGroup(group.group)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') toggleGroup(group.group)
                            }}
                          >
                            ▶
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            className="group-title"
                            onClick={() => toggleGroup(group.group)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') toggleGroup(group.group)
                            }}
                          >
                            {group.group}
                          </span>
                          <span className="group-count">({group.items.length})</span>
                          <button
                            className="group-settings-btn"
                            onClick={() => {
                              let profileType = 'Destination'
                              if (group.group === 'URL Lists (to be deprecated)') {
                                profileType = 'URL Lists'
                              }
                              onNavigateToProfile?.(profileType)
                            }}
                            title={`View ${group.group}`}
                          >
                            ⚙️
                          </button>
                        </div>
                        {expandedGroups.has(group.group) && (
                          <div className="group-items">
                            {group.items.map((option: ProfileOption) => (
                              <label key={option.name} className="option-checkbox">
                                <input
                                  type="checkbox"
                                  checked={rule.selectedValues.includes(option.name)}
                                  onChange={() => handleValueToggle(rule.id, option.name)}
                                />
                                <span className="option-label">{option.name}</span>
                                {option.type !== 'Category' && (
                                  <span className="option-badge">Predefined</span>
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button className="add-rule-btn" onClick={handleAddRule}>
        + Add Rule
      </button>
    </div>
  )
}

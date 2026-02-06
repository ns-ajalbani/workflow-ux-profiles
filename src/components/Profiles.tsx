import { useState, useMemo, useEffect } from 'react'
import profileTypesData from '../data/profileTypes.json'
import type { MatchRule } from './MatchLogic'
import MatchLogic from './MatchLogic'
import './Profiles.css'

interface Profile {
  id: string
  name: string
  type: string
  subtype: string
  category: 'Predefined' | 'Custom'
  created: string
}


const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

type SortField = 'name' | 'type' | 'subtype' | 'category' | 'created'
type SortDirection = 'asc' | 'desc'
type CreationStep = 'type' | 'subtype' | 'complete' | 'configure'

export default function Profiles() {
  // Initialize from URL parameters
  const params = new URLSearchParams(window.location.search)
  const urlType = params.get('type') || ''
  const urlCategory = params.get('category') || ''
  const urlSearch = params.get('search') || ''

  const [selectedType, setSelectedType] = useState<string>(urlType)
  const [selectedSubtype, setSelectedSubtype] = useState<string>(params.get('subtype') || '')
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory)
  const [searchTerm, setSearchTerm] = useState<string>(urlSearch)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [sortField, setSortField] = useState<SortField>('created')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)
  const [creationStep, setCreationStep] = useState<CreationStep>('type')
  const [selectedProfileType, setSelectedProfileType] = useState<string>('')
  const [selectedProfileSubtype, setSelectedProfileSubtype] = useState<string>('')
  const [ruleName, setRuleName] = useState<string>('')
  const [threshold, setThreshold] = useState<number>(70)
  const [categoryName, setCategoryName] = useState<string>('')
  const [categoryDescription, setCategoryDescription] = useState<string>('')
  const [, setMatchRules] = useState<MatchRule[]>([])
  const [malwareScanSelections, setMalwareScanSelections] = useState<Record<string, string[]>>({
    'Netskope File Scanner': [],
    'Allowlist': [],
    'Blocklist': [],
  })
  const [expandedMalwareGroup, setExpandedMalwareGroup] = useState<string | null>(null)

  const [profiles] = useState<Profile[]>([
    {
      id: '1',
      name: 'DLP Profiles Configuration',
      type: 'DLP',
      subtype: 'DLP Profiles',
      category: 'Predefined',
      created: '2024-01-15',
    },
    {
      id: '2',
      name: 'Fingerprint Rule - Document Match',
      type: 'DLP',
      subtype: 'Fingerprint Rules',
      category: 'Predefined',
      created: '2024-01-10',
    },
    {
      id: '3',
      name: 'Malware Detection Profile',
      type: 'Threat Protection',
      subtype: 'Malware Detection',
      category: 'Custom',
      created: '2024-01-05',
    },
    {
      id: '4',
      name: 'Custom Categories Config',
      type: 'Custom Categories',
      subtype: 'N/A',
      category: 'Custom',
      created: '2023-12-20',
    },
    {
      id: '5',
      name: 'AWS Destination Profile',
      type: 'Destination',
      subtype: 'Exact',
      category: 'Predefined',
      created: '2023-12-15',
    },
    {
      id: '6',
      name: 'Salesforce Instance Config',
      type: 'App Instance',
      subtype: 'New App',
      category: 'Predefined',
      created: '2023-12-10',
    },
    {
      id: '7',
      name: 'API Request Header',
      type: 'HTTP Header',
      subtype: 'Request',
      category: 'Custom',
      created: '2023-12-05',
    },
    {
      id: '8',
      name: 'Internal Domain Config',
      type: 'Domain',
      subtype: 'N/A',
      category: 'Custom',
      created: '2023-11-30',
    },
    {
      id: '9',
      name: 'Admin User Profile',
      type: 'User',
      subtype: 'N/A',
      category: 'Predefined',
      created: '2023-11-25',
    },
    {
      id: '10',
      name: 'PDF File Type Profile',
      type: 'File',
      subtype: 'File Type',
      category: 'Predefined',
      created: '2023-11-20',
    },
    {
      id: '11',
      name: 'User Count Constraint',
      type: 'Constraint',
      subtype: 'Users',
      category: 'Custom',
      created: '2023-11-15',
    },
    {
      id: '12',
      name: 'Quarantine Profile Setup',
      type: 'Quarantine',
      subtype: 'Quarantine Profile',
      category: 'Predefined',
      created: '2023-11-10',
    },
    {
      id: '13',
      name: 'Legal Hold Active',
      type: 'Legal Hold',
      subtype: 'N/A',
      category: 'Custom',
      created: '2023-11-05',
    },
    {
      id: '14',
      name: 'Forensic Logging Enabled',
      type: 'Forensic',
      subtype: 'N/A',
      category: 'Predefined',
      created: '2023-10-30',
    },
    {
      id: '15',
      name: 'Remediation Rule',
      type: 'Threat Protection',
      subtype: 'Remediation',
      category: 'Custom',
      created: '2023-10-25',
    },
    {
      id: '16',
      name: 'Network Location Multiple',
      type: 'Network Location',
      subtype: 'Multiple Object',
      category: 'Custom',
      created: '2023-10-20',
    },
  ])

  const filteredProfiles = useMemo(() => {
    let filtered = profiles.filter(profile => {
      const matchesType = !selectedType || profile.type === selectedType
      const matchesSubtype = !selectedSubtype || profile.subtype === selectedSubtype
      const matchesCategory = !selectedCategory || profile.category === selectedCategory
      const matchesSearch =
        !searchTerm ||
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.subtype.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesSubtype && matchesCategory && matchesSearch
    })

    // Sort the filtered results
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'type':
          aValue = a.type.toLowerCase()
          bValue = b.type.toLowerCase()
          break
        case 'subtype':
          aValue = a.subtype.toLowerCase()
          bValue = b.subtype.toLowerCase()
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case 'created':
          aValue = a.created
          bValue = b.created
          break
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [profiles, selectedType, selectedSubtype, selectedCategory, searchTerm, sortField, sortDirection])

  const totalPages = Math.ceil(filteredProfiles.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedType) params.append('type', selectedType)
    if (selectedSubtype) params.append('subtype', selectedSubtype)
    if (selectedCategory) params.append('category', selectedCategory)
    if (searchTerm) params.append('search', searchTerm)

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    window.history.replaceState(null, '', newUrl)
  }, [selectedType, selectedSubtype, selectedCategory, searchTerm])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new sort field with ascending direction
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ''
    return sortDirection === 'asc' ? ' ↑' : ' ↓'
  }

  const handleOpenNewPanel = () => {
    setIsPanelOpen(true)
    setCreationStep('type')
    setSelectedProfileType('')
    setSelectedProfileSubtype('')
  }

  const handleSelectType = (typeName: string) => {
    setSelectedProfileType(typeName)
    const typeObj = profileTypesData.profileTypes.find(t => t.name === typeName)

    // Check if subtype is "N/A" - if so, skip to complete step
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
      setRuleName('')
      setThreshold(70)
    }
  }

  const handleCreateProfile = () => {
    if (selectedProfileType && selectedProfileSubtype && ruleName.trim()) {
      console.log('Creating profile:', {
        type: selectedProfileType,
        subtype: selectedProfileSubtype,
        ruleName: ruleName,
        threshold: threshold,
      })
      // TODO: Add profile creation logic here
      alert(`Profile created!\nType: ${selectedProfileType}\nSubtype: ${selectedProfileSubtype}\nRule Name: ${ruleName}\nThreshold: ${threshold}%`)
      setIsPanelOpen(false)
    }
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setCreationStep('type')
    setSelectedProfileType('')
    setSelectedProfileSubtype('')
    setRuleName('')
    setThreshold(70)
    setCategoryName('')
    setCategoryDescription('')
    setMatchRules([])
    setMalwareScanSelections({ 'Netskope File Scanner': [], 'Allowlist': [], 'Blocklist': [] })
    setExpandedMalwareGroup(null)
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
      setRuleName('')
      setThreshold(70)
    }
  }

  const handleNavigateToProfile = (type: string) => {
    setIsPanelOpen(false)
    // Set filter and update URL
    if (type === 'Destination') {
      setSelectedType('Destination')
    } else if (type === 'URL Lists') {
      setSelectedType('URL Lists')
    }
    // Update URL with filter parameter
    const filterParam = type === 'Destination' ? 'destination' : 'urllists'
    window.history.pushState(null, '', `?filter=${filterParam}`)
  }

  const currentTypeObject = profileTypesData.profileTypes.find(t => t.name === selectedProfileType)
  const availableSubtypes = currentTypeObject?.subtypes || []

  const malwareGroupOptions: Record<string, string[]> = {
    'Netskope File Scanner': ['Default Malware Scan'],
    'Allowlist': ['File Hash Allowlist', 'File Name Allowlist', 'Certificate Allowlist'],
    'Blocklist': ['File Hash Blocklist', 'File Name Blocklist', 'URL Blocklist'],
  }

  const handleMalwareToggle = (group: string, value: string) => {
    setMalwareScanSelections(prev => {
      const current = prev[group] || []
      const isSelected = current.includes(value)
      return {
        ...prev,
        [group]: isSelected ? current.filter(v => v !== value) : [...current, value],
      }
    })
  }

  const handleMalwareSelectAll = (group: string) => {
    const options = malwareGroupOptions[group] || []
    setMalwareScanSelections(prev => {
      const current = prev[group] || []
      return {
        ...prev,
        [group]: current.length === options.length ? [] : [...options],
      }
    })
  }

  return (
    <div className="profiles-container">
      <div className="profiles-header">
        <div className="header-content">
          <h2>Profiles</h2>
          <button className="new-button" onClick={handleOpenNewPanel}>
            + New
          </button>
        </div>
      </div>

      <div className="profiles-filters">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              handleFilterChange()
            }}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="type-filter">Type</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={e => {
              setSelectedType(e.target.value)
              handleFilterChange()
            }}
            className="filter-select"
          >
            <option value="">All Types</option>
            {profileTypesData.profileTypes.map(type => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="subtype-filter">Subtype</label>
          <select
            id="subtype-filter"
            value={selectedSubtype}
            onChange={e => {
              setSelectedSubtype(e.target.value)
              handleFilterChange()
            }}
            className="filter-select"
            disabled={!selectedType}
          >
            <option value="">All Subtypes</option>
            {selectedType &&
              profileTypesData.profileTypes
                .find(t => t.name === selectedType)
                ?.subtypes.map(subtype => (
                  <option key={subtype} value={subtype}>
                    {subtype}
                  </option>
                ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value)
              handleFilterChange()
            }}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Predefined">Predefined</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {(selectedType || selectedSubtype || selectedCategory || searchTerm) && (
          <button
            onClick={() => {
              setSelectedType('')
              setSelectedSubtype('')
              setSelectedCategory('')
              setSearchTerm('')
              handleFilterChange()
            }}
            className="filter-reset"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="profiles-table-wrapper">
        <table className="profiles-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Profile Name{getSortIndicator('name')}
              </th>
              <th onClick={() => handleSort('type')} className="sortable">
                Type{getSortIndicator('type')}
              </th>
              <th onClick={() => handleSort('subtype')} className="sortable">
                Subtype{getSortIndicator('subtype')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category{getSortIndicator('category')}
              </th>
              <th onClick={() => handleSort('created')} className="sortable">
                Created{getSortIndicator('created')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProfiles.length > 0 ? (
              paginatedProfiles.map(profile => (
                <tr key={profile.id}>
                  <td>{profile.name}</td>
                  <td>{profile.type}</td>
                  <td>{profile.subtype}</td>
                  <td>
                    <span className={`category-badge ${profile.category.toLowerCase()}`}>
                      {profile.category}
                    </span>
                  </td>
                  <td>{profile.created}</td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={5}>No profiles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="profiles-footer">
        <div className="footer-info">
          <p>
            Showing {paginatedProfiles.length > 0 ? startIndex + 1 : 0}-
            {Math.min(endIndex, filteredProfiles.length)} of {filteredProfiles.length} profiles
          </p>
        </div>

        <div className="footer-controls">
          <div className="page-size-selector">
            <label htmlFor="page-size">Rows per page:</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={e => handlePageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel Overlay */}
      {isPanelOpen && (
        <div className="side-panel-overlay" onClick={handleClosePanel} />
      )}

      {/* Side Panel */}
      <div className={`side-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="side-panel-header">
          <h3>Create New Profile</h3>
          <button className="close-btn" onClick={handleClosePanel}>×</button>
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
              <button className="back-btn" onClick={handleBackStep}>← Back</button>
              <p className="step-title">Profile Type: <strong>{selectedProfileType}</strong></p>
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
              <button className="back-btn" onClick={handleBackStep}>← Back</button>
              <div className="profile-info">
                <p className="info-label">Profile Type: <strong>{selectedProfileType}</strong></p>
                <p className="info-label">Subtype: <strong>{selectedProfileSubtype}</strong></p>
              </div>
              <button
                className="create-btn"
                onClick={handleNextToConfiguration}
              >
                Next
              </button>
            </div>
          )}

          {creationStep === 'configure' && (
            <div className="step-content">
              <button className="back-btn" onClick={handleBackStep}>← Back</button>
              <div className="profile-info">
                <p className="info-label">Profile Type: <strong>{selectedProfileType}</strong></p>
                {selectedProfileSubtype !== 'N/A' && (
                  <p className="info-label">Subtype: <strong>{selectedProfileSubtype}</strong></p>
                )}
              </div>

              {/* DLP > Fingerprint Rules Form */}
              {selectedProfileType === 'DLP' && selectedProfileSubtype === 'Fingerprint Rules' && (
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
                    <label htmlFor="threshold">
                      Threshold ({threshold}%)
                    </label>
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
                      The recommended default is 70%. Higher values mean stricter matching, while lower values may generate false positives.
                    </p>
                  </div>

                  <button
                    className="create-btn"
                    onClick={handleCreateProfile}
                    disabled={!ruleName.trim()}
                  >
                    Create Profile
                  </button>
                </div>
              )}

              {/* Threat Protection > Malware Detection Form */}
              {selectedProfileType === 'Threat Protection' && selectedProfileSubtype === 'Malware Detection' && (
                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="profile-name">Profile Name</label>
                    <input
                      id="profile-name"
                      type="text"
                      placeholder="Enter profile name"
                      value={ruleName}
                      onChange={e => setRuleName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {Object.entries(malwareGroupOptions).map(([group, options]) => {
                    const selected = malwareScanSelections[group] || []
                    const isExpanded = expandedMalwareGroup === group

                    return (
                      <fieldset key={group} className="form-fieldset">
                        <legend className="form-fieldset-legend">{group}</legend>
                        <button
                          type="button"
                          className="dropdown-checkbox-btn"
                          onClick={() => setExpandedMalwareGroup(isExpanded ? null : group)}
                        >
                          {selected.length > 0 ? (
                            <span className="dropdown-checkbox-count">{selected.length} selected</span>
                          ) : (
                            <span className="dropdown-checkbox-placeholder">Select</span>
                          )}
                          <span className={`dropdown-checkbox-arrow ${isExpanded ? 'open' : ''}`}>&#9660;</span>
                        </button>
                        {isExpanded && (
                          <div className="dropdown-checkbox-panel">
                            {group !== 'Netskope File Scanner' && (
                              <label className="dropdown-checkbox-option dropdown-checkbox-select-all">
                                <input
                                  type="checkbox"
                                  checked={selected.length === options.length}
                                  onChange={() => handleMalwareSelectAll(group)}
                                />
                                <span>Select All ({options.length})</span>
                              </label>
                            )}
                            {options.map(option => (
                              <label key={option} className="dropdown-checkbox-option">
                                <input
                                  type="checkbox"
                                  checked={selected.includes(option)}
                                  onChange={() => handleMalwareToggle(group, option)}
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </fieldset>
                    )
                  })}

                  <button
                    className="create-btn"
                    onClick={handleCreateProfile}
                    disabled={!ruleName.trim()}
                  >
                    Create Profile
                  </button>
                </div>
              )}

              {/* Custom Categories Form */}
              {selectedProfileType === 'Custom Categories' && (
                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="category-name">Custom Category Name</label>
                    <input
                      id="category-name"
                      type="text"
                      placeholder="Enter custom category name"
                      value={categoryName}
                      onChange={e => setCategoryName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category-desc">Description (Optional)</label>
                    <textarea
                      id="category-desc"
                      placeholder="Enter description"
                      value={categoryDescription}
                      onChange={e => setCategoryDescription(e.target.value)}
                      className="form-textarea"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <MatchLogic
                      onRulesChange={setMatchRules}
                      onNavigateToProfile={handleNavigateToProfile}
                    />
                  </div>

                  <button
                    className="create-btn"
                    onClick={handleCreateProfile}
                    disabled={!categoryName.trim()}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

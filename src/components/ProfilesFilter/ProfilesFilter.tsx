import { useState, useMemo } from 'react'
import { MOCK_PROFILES } from '../../data/mockProfiles'
import './ProfilesFilter.css'

interface ActiveFilter {
  field: 'type' | 'subtype' | 'category' | 'search'
  values: string[]
}

interface ProfilesFilterProps {
  selectedType: string
  selectedSubtype: string
  selectedCategory: string
  searchTerm: string
  onTypeChange: (value: string) => void
  onSubtypeChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSearchChange: (value: string) => void
  onFilterChange: () => void
}

export default function ProfilesFilter({
  selectedType,
  selectedSubtype,
  selectedCategory,
  searchTerm,
  onTypeChange,
  onSubtypeChange,
  onCategoryChange,
  onSearchChange,
  onFilterChange,
}: ProfilesFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilterField, setSelectedFilterField] = useState<'type' | 'subtype' | 'category' | 'search' | null>(null)

  // Extract unique values for each filter field
  const typeOptions = useMemo(
    () =>
      Array.from(new Set(MOCK_PROFILES.map(p => p.type)))
        .sort()
        .map(type => ({ value: type, label: type })),
    [],
  )

  const subtypeOptions = useMemo(
    () =>
      Array.from(new Set(MOCK_PROFILES.map(p => p.subtype)))
        .sort()
        .map(subtype => ({ value: subtype, label: subtype })),
    [],
  )

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(MOCK_PROFILES.map(p => p.category)))
        .sort()
        .map(category => ({ value: category, label: category })),
    [],
  )

  // Get current active filters
  const activeFilters: ActiveFilter[] = [
    ...(selectedType ? [{ field: 'type' as const, values: selectedType.split(',').filter(Boolean) }] : []),
    ...(selectedSubtype ? [{ field: 'subtype' as const, values: selectedSubtype.split(',').filter(Boolean) }] : []),
    ...(selectedCategory ? [{ field: 'category' as const, values: selectedCategory.split(',').filter(Boolean) }] : []),
    ...(searchTerm ? [{ field: 'search' as const, values: [searchTerm] }] : []),
  ]

  const hasActiveFilters = activeFilters.length > 0

  // Get options for the currently selected filter field
  const currentOptions = useMemo(() => {
    switch (selectedFilterField) {
      case 'type':
        return typeOptions
      case 'subtype':
        return subtypeOptions
      case 'category':
        return categoryOptions
      default:
        return []
    }
  }, [selectedFilterField, typeOptions, subtypeOptions, categoryOptions])

  // Filter options based on search query
  const filteredOptions = useMemo(
    () =>
      currentOptions.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [currentOptions, searchQuery],
  )

  const handleAddFilter = (field: 'type' | 'subtype' | 'category' | 'search') => {
    setSelectedFilterField(field)
    setSearchQuery('')
    setIsOpen(true)
  }

  const handleSelectOption = (value: string) => {
    if (!selectedFilterField) return

    const setter = {
      type: onTypeChange,
      subtype: onSubtypeChange,
      category: onCategoryChange,
      search: onSearchChange,
    }[selectedFilterField]

    const currentValue = {
      type: selectedType,
      subtype: selectedSubtype,
      category: selectedCategory,
      search: searchTerm,
    }[selectedFilterField]

    const values = currentValue ? currentValue.split(',') : []
    if (values.includes(value)) {
      values.splice(values.indexOf(value), 1)
    } else {
      values.push(value)
    }

    setter(values.join(','))
    onFilterChange()
  }

  const handleRemoveFilterValue = (field: ActiveFilter['field'], value: string) => {
    const setter = {
      type: onTypeChange,
      subtype: onSubtypeChange,
      category: onCategoryChange,
      search: onSearchChange,
    }[field]

    const currentValue = {
      type: selectedType,
      subtype: selectedSubtype,
      category: selectedCategory,
      search: searchTerm,
    }[field]

    if (field === 'search') {
      setter('')
    } else {
      const values = currentValue.split(',').filter(v => v !== value)
      setter(values.join(','))
    }
    onFilterChange()
  }

  const handleClearAllFilters = () => {
    onTypeChange('')
    onSubtypeChange('')
    onCategoryChange('')
    onSearchChange('')
    onFilterChange()
    setIsOpen(false)
  }

  const handleTextSearch = (value: string) => {
    onSearchChange(value)
    onFilterChange()
    setIsOpen(false)
  }

  const isChecked = (value: string) => {
    if (!selectedFilterField) return false
    const currentValue = {
      type: selectedType,
      subtype: selectedSubtype,
      category: selectedCategory,
      search: searchTerm,
    }[selectedFilterField]
    return currentValue.split(',').includes(value)
  }

  return (
    <div className="profiles-filters">
      <div className="filters-header">
        <div className="filters-title">Filters</div>
        <div className="filters-controls">
          <button
            className="add-filter-btn"
            onClick={() => {
              if (isOpen && selectedFilterField === null) {
                setIsOpen(false)
              } else {
                setSelectedFilterField(null)
                setIsOpen(!isOpen)
              }
            }}
          >
            Add Filter
          </button>
          {hasActiveFilters && (
            <button className="clear-btn" onClick={handleClearAllFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          {activeFilters.map(filter =>
            filter.values.map(value => (
              <div key={`${filter.field}-${value}`} className="filter-tag">
                <span className="tag-label">
                  {filter.field === 'search' ? '🔎' : ''} {value}
                </span>
                <button
                  className="tag-remove"
                  onClick={() => handleRemoveFilterValue(filter.field, value)}
                  aria-label={`Remove ${filter.field} filter: ${value}`}
                >
                  ✕
                </button>
              </div>
            )),
          )}
        </div>
      )}

      {/* Filter Dropdown */}
      {isOpen && (
        <div className="filter-dropdown">
          {selectedFilterField === null ? (
            <div className="filter-menu">
              <input
                type="text"
                placeholder="Search filter"
                className="filter-search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />

              <button
                className="filter-menu-item"
                onClick={() => handleAddFilter('type')}
              >
                <span>Type</span>
                <span className="arrow">›</span>
              </button>

              <button
                className="filter-menu-item"
                onClick={() => handleAddFilter('subtype')}
              >
                <span>Subtype</span>
                <span className="arrow">›</span>
              </button>

              <button
                className="filter-menu-item"
                onClick={() => handleAddFilter('category')}
              >
                <span>Category</span>
                <span className="arrow">›</span>
              </button>

              <button
                className="filter-menu-item search-item"
                onClick={() => handleAddFilter('search')}
              >
                <span>Search</span>
                <span className="search-icon">🔍</span>
              </button>
            </div>
          ) : selectedFilterField === 'search' ? (
            <div className="filter-options search-filter">
              <input
                type="text"
                placeholder="Enter search term"
                className="search-input"
                autoFocus
                value={searchTerm}
                onChange={e => handleTextSearch(e.target.value)}
              />
            </div>
          ) : (
            <div className="filter-options">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <label key={option.value} className="filter-option">
                    <input
                      type="checkbox"
                      checked={isChecked(option.value)}
                      onChange={() => handleSelectOption(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))
              ) : (
                <div className="no-options">No options found</div>
              )}
              {(selectedType || selectedSubtype || selectedCategory || searchTerm) && (
                <button
                  className="clear-filter-options"
                  onClick={handleClearAllFilters}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

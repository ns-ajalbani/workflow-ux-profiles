import profileTypesData from '../../data/profileTypes.json'

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
  return (
    <div className="profiles-filters">
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search profiles..."
          value={searchTerm}
          onChange={e => {
            onSearchChange(e.target.value)
            onFilterChange()
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
            onTypeChange(e.target.value)
            onFilterChange()
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
            onSubtypeChange(e.target.value)
            onFilterChange()
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
            onCategoryChange(e.target.value)
            onFilterChange()
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
            onTypeChange('')
            onSubtypeChange('')
            onCategoryChange('')
            onSearchChange('')
            onFilterChange()
          }}
          className="filter-reset"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

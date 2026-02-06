import { useState, useMemo, useEffect } from 'react'
import ProfilesFilter from './ProfilesFilter'
import ProfilesTable from './ProfilesTable'
import SidePanel from './SidePanel'
import './Profiles.css'

export interface Profile {
  id: string
  name: string
  type: string
  subtype: string
  category: 'Predefined' | 'Custom'
  created: string
}

export type SortField = 'name' | 'type' | 'subtype' | 'category' | 'created'
type SortDirection = 'asc' | 'desc'

export default function Profiles() {
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
    const filtered = profiles.filter(profile => {
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
  }, [
    profiles,
    selectedType,
    selectedSubtype,
    selectedCategory,
    searchTerm,
    sortField,
    sortDirection,
  ])

  const totalPages = Math.ceil(filteredProfiles.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex)

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleNavigateToProfile = (type: string) => {
    setIsPanelOpen(false)
    if (type === 'Destination') {
      setSelectedType('Destination')
    } else if (type === 'URL Lists') {
      setSelectedType('URL Lists')
    }
    const filterParam = type === 'Destination' ? 'destination' : 'urllists'
    window.history.pushState(null, '', `?filter=${filterParam}`)
  }

  return (
    <div className="profiles-container">
      <div className="profiles-header">
        <div className="header-content">
          <h2>Profiles</h2>
          <button className="new-button" onClick={() => setIsPanelOpen(true)}>
            + New
          </button>
        </div>
      </div>

      <ProfilesFilter
        selectedType={selectedType}
        selectedSubtype={selectedSubtype}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onTypeChange={setSelectedType}
        onSubtypeChange={setSelectedSubtype}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
      />

      <ProfilesTable
        paginatedProfiles={paginatedProfiles}
        filteredCount={filteredProfiles.length}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onPageChange={setCurrentPage}
        onPageSizeChange={size => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </div>
  )
}

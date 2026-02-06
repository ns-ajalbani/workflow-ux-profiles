import { useState, useEffect } from 'react'
import ProfilesFilter from './ProfilesFilter'
import ProfilesTable from './ProfilesTable'
import SidePanel from './SidePanel'
import { fetchProfiles } from '../api/mockApi'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paginatedProfiles, setPaginatedProfiles] = useState<Profile[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  // Fetch data from API whenever filters, pagination, or sorting changes
  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true)
      try {
        const response = await fetchProfiles(
          {
            page: currentPage,
            pageSize,
            sortField,
            sortDirection,
          },
          {
            type: selectedType || undefined,
            subtype: selectedSubtype || undefined,
            category: selectedCategory || undefined,
            search: searchTerm || undefined,
          }
        )
        setPaginatedProfiles(response.data)
        setTotalCount(response.total)
      } catch (error) {
        console.error('Failed to fetch profiles:', error)
        setPaginatedProfiles([])
        setTotalCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfiles()
  }, [currentPage, pageSize, sortField, sortDirection, selectedType, selectedSubtype, selectedCategory, searchTerm])

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

  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

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
        filteredCount={totalCount}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        sortField={sortField}
        sortDirection={sortDirection}
        isLoading={isLoading}
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

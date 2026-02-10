import { useState, useEffect } from 'react'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import ProfilesFilter from '../ProfilesFilter'
import ProfilesTable from '../ProfilesTable'
import SidePanel from '../SidePanel'
import { fetchProfiles, fetchProfile, deleteProfile } from '../../api/mockApi'
import './Profiles.css'

export interface Profile {
  id: string
  name: string
  type: string
  subtype: string
  category: 'Predefined' | 'Custom'
  created: string
  createdBy: string
}

export type SortField = 'name' | 'type' | 'subtype' | 'category' | 'created' | 'createdBy'
type SortDirection = 'asc' | 'desc'

export default function Profiles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { editId: urlEditId } = useParams<{ editId: string }>()
  const navigate = useNavigate()
  const urlType = searchParams.get('type') || ''
  const urlCategory = searchParams.get('category') || ''
  const urlSearch = searchParams.get('search') || ''

  const [selectedType, setSelectedType] = useState<string>(urlType)
  const [selectedSubtype, setSelectedSubtype] = useState<string>(searchParams.get('subtype') || '')
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
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

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
          },
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
  }, [
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    selectedType,
    selectedSubtype,
    selectedCategory,
    searchTerm,
    refreshKey,
  ])

  // Load profile from URL path parameter (/profiles/:editId)
  useEffect(() => {
    if (urlEditId) {
      fetchProfile(urlEditId)
        .then(profile => {
          setEditingProfile(profile)
          setIsPanelOpen(true)
        })
        .catch(error => {
          console.error('Failed to fetch profile:', error)
          navigate('/profiles')
        })
    }
  }, [urlEditId, navigate])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedType) params.set('type', selectedType)
    if (selectedSubtype) params.set('subtype', selectedSubtype)
    if (selectedCategory) params.set('category', selectedCategory)
    if (searchTerm) params.set('search', searchTerm)

    setSearchParams(params, { replace: true })
  }, [selectedType, selectedSubtype, selectedCategory, searchTerm, setSearchParams])

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
    setSearchParams({ filter: filterParam })
  }

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile)
    setIsPanelOpen(true)
    navigate(`/profiles/${profile.id}`)
  }

  const handleDeleteProfile = async (profileId: string) => {
    try {
      await deleteProfile(profileId)
      setRefreshKey(k => k + 1)
    } catch (error) {
      console.error('Failed to delete profile:', error)
    }
  }

  return (
    <div className="profiles-container">
      <div className="profiles-header">
        <div className="header-content">
          <h1>Profiles</h1>
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
        onEditProfile={handleEditProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false)
          setEditingProfile(null)
          if (urlEditId) {
            navigate('/profiles')
          }
        }}
        onNavigateToProfile={handleNavigateToProfile}
        editingProfile={editingProfile}
      />
    </div>
  )
}

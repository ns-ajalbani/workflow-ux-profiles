import type { Profile, SortField } from '../components/Profiles'
import { MOCK_PROFILES } from '../data/mockProfiles'

export interface PaginationParams {
  page: number
  pageSize: number
  sortField: SortField
  sortDirection: 'asc' | 'desc'
}

export interface FilterParams {
  type?: string
  subtype?: string
  category?: string
  search?: string
}

export interface ApiResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// Client-side pagination, sorting, and filtering
export async function fetchProfile(id: string): Promise<Profile> {
  console.log(`📡 Loading Profile - ID: ${id}`)

  // Simulate async behavior
  await new Promise(resolve => setTimeout(resolve, 100))

  const profile = MOCK_PROFILES.find(p => p.id === id)
  if (!profile) {
    throw new Error(`Profile not found: ${id}`)
  }

  console.log(`✅ Profile Loaded: ${profile.name}`)
  return profile
}

export async function deleteProfile(id: string): Promise<void> {
  console.log(`📡 Deleting Profile - ID: ${id}`)

  // Simulate async behavior
  await new Promise(resolve => setTimeout(resolve, 100))

  const index = MOCK_PROFILES.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error(`Profile not found: ${id}`)
  }

  // In a real app, this would delete from server
  console.log(`✅ Profile Deleted`)
}

export async function fetchProfiles(
  pagination: PaginationParams,
  filters: FilterParams,
): Promise<ApiResponse<Profile>> {
  console.log(`📡 Loading Profiles - Page: ${pagination.page}, PageSize: ${pagination.pageSize}`)

  // Simulate async behavior
  await new Promise(resolve => setTimeout(resolve, 100))

  // Filter data
  let filtered = MOCK_PROFILES.filter(profile => {
    if (filters.type && profile.type !== filters.type) return false
    if (filters.subtype && profile.subtype !== filters.subtype) return false
    if (filters.category && profile.category !== filters.category) return false
    if (
      filters.search &&
      !profile.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }
    return true
  })

  // Sort data
  const sortMultiplier = pagination.sortDirection === 'asc' ? 1 : -1
  filtered.sort((a, b) => {
    const aValue = a[pagination.sortField as keyof Profile]
    const bValue = b[pagination.sortField as keyof Profile]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * sortMultiplier
    }
    return 0
  })

  // Paginate data
  const total = filtered.length
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  const data = filtered.slice(start, end)

  console.log(
    `✅ Profiles Loaded - Returning ${data.length} items (Total: ${total}, Page: ${pagination.page})`
  )

  return {
    data,
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
  }
}

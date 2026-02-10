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

// Helper function to simulate network request with blob URL
async function simulateNetworkRequest<T>(data: T, label: string): Promise<T> {
  console.log(`📡 ${label}`)

  // Create blob with JSON data
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  try {
    // Make actual fetch call to blob URL - creates visible Network tab entry
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`)
    }

    const result = await response.json()
    console.log(`✅ ${label} Complete`)
    return result
  } finally {
    // Clean up blob URL
    URL.revokeObjectURL(url)
  }
}

// Client-side pagination, sorting, and filtering
export async function fetchProfile(id: string): Promise<Profile> {
  const profile = MOCK_PROFILES.find(p => p.id === id)
  if (!profile) {
    throw new Error(`Profile not found: ${id}`)
  }

  return simulateNetworkRequest(profile, `Loading Profile - ID: ${id}`)
}

export async function deleteProfile(id: string): Promise<void> {
  const index = MOCK_PROFILES.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error(`Profile not found: ${id}`)
  }

  await simulateNetworkRequest({ success: true }, `Deleting Profile - ID: ${id}`)
}

export async function fetchProfiles(
  pagination: PaginationParams,
  filters: FilterParams,
): Promise<ApiResponse<Profile>> {
  // Parse comma-separated filter values
  const typeValues = filters.type ? filters.type.split(',').filter(Boolean) : []
  const subtypeValues = filters.subtype ? filters.subtype.split(',').filter(Boolean) : []
  const categoryValues = filters.category ? filters.category.split(',').filter(Boolean) : []

  // Filter data (additive: all conditions must match)
  const filtered = MOCK_PROFILES.filter(profile => {
    // Type filter: if specified, profile type must be in the list
    if (typeValues.length > 0 && !typeValues.includes(profile.type)) return false
    // Subtype filter: if specified, profile subtype must be in the list
    if (subtypeValues.length > 0 && !subtypeValues.includes(profile.subtype)) return false
    // Category filter: if specified, profile category must be in the list
    if (categoryValues.length > 0 && !categoryValues.includes(profile.category)) return false
    // Search filter: if specified, profile name must include the search term
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

  const response: ApiResponse<Profile> = {
    data,
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
  }

  return simulateNetworkRequest(
    response,
    `Loading Profiles - Page: ${pagination.page}, PageSize: ${pagination.pageSize}`
  )
}

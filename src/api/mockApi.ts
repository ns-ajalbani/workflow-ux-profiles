import type { Profile, SortField } from '../components/Profiles'

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

// API endpoint - update this to your backend URL
const API_BASE_URL = 'http://localhost:3000/api'

export async function fetchProfiles(
  pagination: PaginationParams,
  filters: FilterParams
): Promise<ApiResponse<Profile>> {
  // Build query parameters
  const params = new URLSearchParams({
    page: pagination.page.toString(),
    pageSize: pagination.pageSize.toString(),
    sortField: pagination.sortField,
    sortDirection: pagination.sortDirection,
  })

  // Add active filters only
  if (filters.type) params.append('type', filters.type)
  if (filters.subtype) params.append('subtype', filters.subtype)
  if (filters.category) params.append('category', filters.category)
  if (filters.search) params.append('search', filters.search)

  console.log(
    `📡 API Call - GET ${API_BASE_URL}/profiles?${params.toString()}`
  )

  try {
    const response = await fetch(`${API_BASE_URL}/profiles?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(
      `✅ API Response - Returning ${data.data.length} items (Total: ${data.total})`
    )
    return data
  } catch (error) {
    console.error('❌ API Error:', error)
    throw error
  }
}

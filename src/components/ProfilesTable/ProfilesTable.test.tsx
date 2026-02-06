import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfilesTable from './ProfilesTable'
import type { Profile } from '../Profiles'

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Test Profile',
    type: 'DLP',
    subtype: 'Fingerprint Rules',
    category: 'Predefined',
    created: '2024-02-05T10:00:00Z',
  },
]

const defaultProps = {
  paginatedProfiles: mockProfiles,
  filteredCount: 1,
  startIndex: 0,
  endIndex: 1,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  sortField: 'created' as const,
  sortDirection: 'desc' as const,
  onSort: vi.fn(),
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
}

describe('ProfilesTable', () => {
  it('renders table headers', () => {
    render(<ProfilesTable {...defaultProps} />)
    expect(screen.getByText(/Profile Name/)).toBeInTheDocument()
    expect(screen.getByText(/Type/)).toBeInTheDocument()
    expect(screen.getByText(/Subtype/)).toBeInTheDocument()
    expect(screen.getByText(/Category/)).toBeInTheDocument()
    expect(screen.getByText(/Created/)).toBeInTheDocument()
  })

  it('renders profile data', () => {
    render(<ProfilesTable {...defaultProps} />)
    expect(screen.getByText('Test Profile')).toBeInTheDocument()
    expect(screen.getByText('DLP')).toBeInTheDocument()
    expect(screen.getByText('Fingerprint Rules')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<ProfilesTable {...defaultProps} isLoading paginatedProfiles={[]} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<ProfilesTable {...defaultProps} paginatedProfiles={[]} filteredCount={0} />)
    expect(screen.getByText('No profiles found')).toBeInTheDocument()
  })

  it('displays pagination info', () => {
    render(<ProfilesTable {...defaultProps} />)
    expect(screen.getByText(/Showing 1-1 of 1 profiles/)).toBeInTheDocument()
  })

  it('calls onSort when header clicked', async () => {
    const onSort = vi.fn()
    render(<ProfilesTable {...defaultProps} onSort={onSort} />)
    await userEvent.click(screen.getByText(/Profile Name/))
    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('shows sort indicator on active column', () => {
    render(<ProfilesTable {...defaultProps} sortField="created" sortDirection="desc" />)
    expect(screen.getByText(/Created.*↓/)).toBeInTheDocument()
  })
})

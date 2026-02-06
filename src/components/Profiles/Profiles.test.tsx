import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Profiles from './Profiles'
import * as mockApi from '../../api/mockApi'

vi.mock('../../api/mockApi')

const mockProfiles = [
  {
    id: '1',
    name: 'DLP Profile',
    type: 'DLP',
    subtype: 'Fingerprint Rules',
    category: 'Predefined' as const,
    created: '2024-02-05T10:00:00Z',
  },
]

describe('Profiles', () => {
  beforeEach(() => {
    vi.mocked(mockApi.fetchProfiles).mockResolvedValue({
      data: mockProfiles,
      total: 1,
      page: 1,
      pageSize: 10,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders header and new button', () => {
    render(<Profiles />)
    expect(screen.getByText('Profiles')).toBeInTheDocument()
    expect(screen.getByText('+ New')).toBeInTheDocument()
  })

  it('fetches profiles on mount', async () => {
    render(<Profiles />)
    await waitFor(() => {
      expect(mockApi.fetchProfiles).toHaveBeenCalled()
    })
  })

  it('displays loaded profiles', async () => {
    render(<Profiles />)
    await waitFor(() => {
      expect(screen.getByText('DLP Profile')).toBeInTheDocument()
    })
  })

  it('opens side panel when New clicked', async () => {
    render(<Profiles />)
    await userEvent.click(screen.getByText('+ New'))
    expect(screen.getByText('Create New Profile')).toBeInTheDocument()
  })

  it('renders filter controls', () => {
    render(<Profiles />)
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })
})

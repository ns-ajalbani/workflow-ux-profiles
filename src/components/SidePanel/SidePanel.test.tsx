import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SidePanel from './SidePanel'

const defaultProps = {
  isOpen: false,
  onClose: vi.fn(),
  onNavigateToProfile: vi.fn(),
}

describe('SidePanel', () => {
  it('renders without crashing when closed', () => {
    const { container } = render(<SidePanel {...defaultProps} />)
    expect(container).toBeInTheDocument()
  })

  it('shows header when open', () => {
    render(<SidePanel {...defaultProps} isOpen />)
    expect(screen.getByText('Create New Profile')).toBeInTheDocument()
  })

  it('shows profile type options when open', () => {
    render(<SidePanel {...defaultProps} isOpen />)
    expect(screen.getByText('Select a profile type:')).toBeInTheDocument()
    expect(screen.getByText('DLP')).toBeInTheDocument()
    expect(screen.getByText('Destination')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn()
    render(<SidePanel {...defaultProps} isOpen onClose={onClose} />)
    await userEvent.click(screen.getByText('×'))
    expect(onClose).toHaveBeenCalled()
  })

  it('navigates to subtype step when type selected', async () => {
    render(<SidePanel {...defaultProps} isOpen />)
    await userEvent.click(screen.getByText('DLP'))
    expect(screen.getByText('Select a subtype:')).toBeInTheDocument()
    expect(screen.getByText('← Back')).toBeInTheDocument()
  })
})

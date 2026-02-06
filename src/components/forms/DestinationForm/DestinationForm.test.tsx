import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DestinationForm from './DestinationForm'

describe('DestinationForm', () => {
  it('renders profile name input', () => {
    render(<DestinationForm subtype="CIDR" onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Destination Profile Name')).toBeInTheDocument()
  })

  it('renders description textarea', () => {
    render(<DestinationForm subtype="CIDR" onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Description (Optional)')).toBeInTheDocument()
  })

  it('renders definition fieldset', () => {
    render(<DestinationForm subtype="CIDR" onSubmit={vi.fn()} />)
    expect(screen.getByText('Definition')).toBeInTheDocument()
  })

  it('renders save button disabled when empty', () => {
    render(<DestinationForm subtype="CIDR" onSubmit={vi.fn()} />)
    expect(screen.getByText('Save')).toBeDisabled()
  })

  it('enables save button when name entered', async () => {
    render(<DestinationForm subtype="CIDR" onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('Destination Profile Name'), 'My Dest')
    expect(screen.getByText('Save')).not.toBeDisabled()
  })

  it('shows case insensitive checkbox for Exact subtype', () => {
    render(<DestinationForm subtype="Exact" onSubmit={vi.fn()} />)
    expect(screen.getByText('Case Insensitive')).toBeInTheDocument()
  })

  it('hides case insensitive checkbox for non-Exact subtype', () => {
    render(<DestinationForm subtype="CIDR" onSubmit={vi.fn()} />)
    expect(screen.queryByText('Case Insensitive')).not.toBeInTheDocument()
  })
})

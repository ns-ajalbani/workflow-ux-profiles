import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorkflowProfiles from './WorkflowProfiles'

describe('WorkflowProfiles', () => {
  it('renders header', () => {
    render(<WorkflowProfiles />)
    expect(screen.getByText('Workflow Profiles')).toBeInTheDocument()
  })

  it('renders profile cards', () => {
    render(<WorkflowProfiles />)
    expect(screen.getByText('Quick Approval')).toBeInTheDocument()
    expect(screen.getByText('Standard Review')).toBeInTheDocument()
    expect(screen.getByText('Executive Sign-off')).toBeInTheDocument()
  })

  it('shows active badge on default profile', () => {
    render(<WorkflowProfiles />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('calls onSelectProfile when card clicked', async () => {
    const onSelect = vi.fn()
    render(<WorkflowProfiles onSelectProfile={onSelect} />)
    await userEvent.click(screen.getByText('Standard Review'))
    expect(onSelect).toHaveBeenCalled()
  })
})

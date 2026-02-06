import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FingerprintRulesForm from './FingerprintRulesForm'

describe('FingerprintRulesForm', () => {
  it('renders rule name input and threshold', () => {
    render(<FingerprintRulesForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Rule Name')).toBeInTheDocument()
    expect(screen.getByLabelText(/Threshold/)).toBeInTheDocument()
  })

  it('renders save button disabled when empty', () => {
    render(<FingerprintRulesForm onSubmit={vi.fn()} />)
    expect(screen.getByText('Create Profile')).toBeDisabled()
  })

  it('enables save button when name entered', async () => {
    render(<FingerprintRulesForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('Rule Name'), 'My Rule')
    expect(screen.getByText('Create Profile')).not.toBeDisabled()
  })
})

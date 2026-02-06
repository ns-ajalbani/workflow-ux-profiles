import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UrlListsForm from './UrlListsForm'

describe('UrlListsForm', () => {
  it('renders name input', () => {
    render(<UrlListsForm onSubmit={vi.fn()} />)
    expect(screen.getByPlaceholderText('Enter URL List name')).toBeInTheDocument()
  })

  it('renders URL textarea', () => {
    render(<UrlListsForm onSubmit={vi.fn()} />)
    expect(
      screen.getByPlaceholderText('Enter URL or IP Address separated by new line'),
    ).toBeInTheDocument()
  })

  it('renders save button disabled when empty', () => {
    render(<UrlListsForm onSubmit={vi.fn()} />)
    expect(screen.getByText('Save')).toBeDisabled()
  })

  it('enables save button when name entered', async () => {
    render(<UrlListsForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Enter URL List name'), 'My List')
    expect(screen.getByText('Save')).not.toBeDisabled()
  })
})

import { render, screen } from '@testing-library/react'
import CustomCategoriesForm from './CustomCategoriesForm'

describe('CustomCategoriesForm', () => {
  it('renders name input', () => {
    render(<CustomCategoriesForm onNavigateToProfile={vi.fn()} onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Custom Category Name')).toBeInTheDocument()
  })

  it('renders description textarea', () => {
    render(<CustomCategoriesForm onNavigateToProfile={vi.fn()} onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Description (Optional)')).toBeInTheDocument()
  })

  it('renders save button disabled when empty', () => {
    render(<CustomCategoriesForm onNavigateToProfile={vi.fn()} onSubmit={vi.fn()} />)
    expect(screen.getByText('Save')).toBeDisabled()
  })
})

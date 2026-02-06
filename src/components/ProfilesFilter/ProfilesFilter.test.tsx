import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfilesFilter from './ProfilesFilter'

const defaultProps = {
  selectedType: '',
  selectedSubtype: '',
  selectedCategory: '',
  searchTerm: '',
  onTypeChange: vi.fn(),
  onSubtypeChange: vi.fn(),
  onCategoryChange: vi.fn(),
  onSearchChange: vi.fn(),
  onFilterChange: vi.fn(),
}

describe('ProfilesFilter', () => {
  it('renders all filter controls', () => {
    render(<ProfilesFilter {...defaultProps} />)
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByLabelText('Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Subtype')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing in search', async () => {
    const onSearchChange = vi.fn()
    render(<ProfilesFilter {...defaultProps} onSearchChange={onSearchChange} />)
    await userEvent.type(screen.getByLabelText('Search'), 'a')
    expect(onSearchChange).toHaveBeenCalled()
  })

  it('disables subtype when no type selected', () => {
    render(<ProfilesFilter {...defaultProps} />)
    expect(screen.getByLabelText('Subtype')).toBeDisabled()
  })

  it('enables subtype when type is selected', () => {
    render(<ProfilesFilter {...defaultProps} selectedType="DLP" />)
    expect(screen.getByLabelText('Subtype')).not.toBeDisabled()
  })

  it('shows clear button when filters are active', () => {
    render(<ProfilesFilter {...defaultProps} searchTerm="test" />)
    expect(screen.getByText('Clear Filters')).toBeInTheDocument()
  })

  it('hides clear button when no filters active', () => {
    render(<ProfilesFilter {...defaultProps} />)
    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument()
  })

  it('calls all reset handlers on clear', async () => {
    const handlers = {
      onTypeChange: vi.fn(),
      onSubtypeChange: vi.fn(),
      onCategoryChange: vi.fn(),
      onSearchChange: vi.fn(),
      onFilterChange: vi.fn(),
    }
    render(<ProfilesFilter {...defaultProps} {...handlers} searchTerm="test" />)
    await userEvent.click(screen.getByText('Clear Filters'))
    expect(handlers.onTypeChange).toHaveBeenCalledWith('')
    expect(handlers.onSubtypeChange).toHaveBeenCalledWith('')
    expect(handlers.onCategoryChange).toHaveBeenCalledWith('')
    expect(handlers.onSearchChange).toHaveBeenCalledWith('')
  })
})

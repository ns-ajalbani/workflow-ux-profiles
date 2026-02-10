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
  it('renders filter controls', () => {
    render(<ProfilesFilter {...defaultProps} />)
    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('Add Filter')).toBeInTheDocument()
  })

  it('opens filter menu when Add Filter is clicked', async () => {
    render(<ProfilesFilter {...defaultProps} />)
    await userEvent.click(screen.getByText('Add Filter'))
    expect(screen.getByPlaceholderText('Search filter')).toBeInTheDocument()
  })

  it('shows filter field options in dropdown menu', async () => {
    render(<ProfilesFilter {...defaultProps} />)
    await userEvent.click(screen.getByText('Add Filter'))
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Subtype')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
  })

  it('displays active filters as tags', () => {
    render(<ProfilesFilter {...defaultProps} selectedType="DLP" />)
    expect(screen.getByText('DLP')).toBeInTheDocument()
  })

  it('shows clear button when filters are active', () => {
    render(<ProfilesFilter {...defaultProps} searchTerm="test" />)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('hides clear button when no filters active', () => {
    render(<ProfilesFilter {...defaultProps} />)
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('calls all reset handlers on clear', async () => {
    const handlers = {
      onTypeChange: vi.fn(),
      onSubtypeChange: vi.fn(),
      onCategoryChange: vi.fn(),
      onSearchChange: vi.fn(),
      onFilterChange: vi.fn(),
    }
    render(
      <ProfilesFilter
        {...defaultProps}
        {...handlers}
        selectedType="DLP"
        searchTerm="test"
      />,
    )
    const clearBtn = screen.getAllByText('Clear')[0]
    await userEvent.click(clearBtn)
    expect(handlers.onTypeChange).toHaveBeenCalledWith('')
    expect(handlers.onSubtypeChange).toHaveBeenCalledWith('')
    expect(handlers.onCategoryChange).toHaveBeenCalledWith('')
    expect(handlers.onSearchChange).toHaveBeenCalledWith('')
  })

  it('removes individual filter tags', async () => {
    const onTypeChange = vi.fn()
    render(<ProfilesFilter {...defaultProps} selectedType="DLP" onTypeChange={onTypeChange} />)
    const removeBtn = screen.getByRole('button', { name: /Remove/i })
    await userEvent.click(removeBtn)
    expect(onTypeChange).toHaveBeenCalledWith('')
  })

  it('supports multi-select filters', async () => {
    const onTypeChange = vi.fn()
    render(<ProfilesFilter {...defaultProps} onTypeChange={onTypeChange} />)
    await userEvent.click(screen.getByText('Add Filter'))
    await userEvent.click(screen.getByText('Type'))

    // Select multiple types
    const dlpOption = screen.getByLabelText('DLP')
    await userEvent.click(dlpOption)
    expect(onTypeChange).toHaveBeenCalledWith('DLP')
  })
})

import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'

describe('AppRoutes', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('renders Routes component', () => {
    renderWithRouter(<AppRoutes />)
    // Routes component renders content based on current path
    expect(screen.getByText('Profiles')).toBeInTheDocument()
  })

  it('renders Profiles page at /profiles route', () => {
    window.history.pushState({}, 'Profiles', '/profiles')
    renderWithRouter(<AppRoutes />)
    expect(screen.getByText('Profiles')).toBeInTheDocument()
  })

  it('renders Policies page at /policies route', () => {
    window.history.pushState({}, 'Policies', '/policies')
    renderWithRouter(<AppRoutes />)
    expect(screen.getByText('Policies')).toBeInTheDocument()
    expect(screen.getByText('Manage your workflow policies here.')).toBeInTheDocument()
  })

  it('renders page-content div with correct structure', () => {
    window.history.pushState({}, 'Policies', '/policies')
    renderWithRouter(<AppRoutes />)
    const pageContent = screen.getByText('Policies').closest('h2')?.parentElement
    expect(pageContent).toHaveClass('page-content')
  })
})

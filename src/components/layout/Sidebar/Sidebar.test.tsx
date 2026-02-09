import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('renders the sidebar', () => {
    renderWithRouter(<Sidebar />)
    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toBeInTheDocument()
  })

  it('has correct sidebar CSS class', () => {
    renderWithRouter(<Sidebar />)
    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveClass('sidebar')
  })

  it('renders navigation menu', () => {
    renderWithRouter(<Sidebar />)
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('has correct nav CSS class', () => {
    renderWithRouter(<Sidebar />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('sidebar-nav')
  })

  it('renders Policies link', () => {
    renderWithRouter(<Sidebar />)
    const policiesLink = screen.getByText('Policies')
    expect(policiesLink).toBeInTheDocument()
    expect(policiesLink).toHaveAttribute('href', '/policies')
  })

  it('renders Profiles link', () => {
    renderWithRouter(<Sidebar />)
    const profilesLink = screen.getByText('Profiles')
    expect(profilesLink).toBeInTheDocument()
    expect(profilesLink).toHaveAttribute('href', '/profiles')
  })

  it('Policies link has menu-item class', () => {
    renderWithRouter(<Sidebar />)
    const policiesLink = screen.getByText('Policies')
    expect(policiesLink).toHaveClass('menu-item')
  })

  it('Profiles link has menu-item class', () => {
    renderWithRouter(<Sidebar />)
    const profilesLink = screen.getByText('Profiles')
    expect(profilesLink).toHaveClass('menu-item')
  })
})

import { render, screen } from '@testing-library/react'
import { Topbar } from './Topbar'

describe('Topbar', () => {
  it('renders the topbar header', () => {
    render(<Topbar />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('renders the Netskope logo image', () => {
    render(<Topbar />)
    const logo = screen.getByAltText('Netskope')
    expect(logo).toBeInTheDocument()
  })

  it('has correct logo src', () => {
    render(<Topbar />)
    const logo = screen.getByAltText('Netskope') as HTMLImageElement
    expect(logo.src).toBe(
      'https://webui-qe01-dfw3-mp-prod.goskope.com/UI_Layer/img/favicon/favicon-16.png'
    )
  })

  it('renders the logo text', () => {
    render(<Topbar />)
    const text = screen.getByText('Netskope')
    expect(text).toBeInTheDocument()
  })

  it('has correct topbar CSS class', () => {
    render(<Topbar />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('topbar')
  })
})

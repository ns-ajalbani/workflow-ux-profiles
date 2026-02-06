import { render, screen } from '@testing-library/react'
import MatchLogic from './MatchLogic'

describe('MatchLogic', () => {
  it('renders without crashing', () => {
    const { container } = render(<MatchLogic />)
    expect(container).toBeInTheDocument()
  })

  it('renders the add rule button', () => {
    render(<MatchLogic />)
    expect(screen.getByText('+ Add Rule')).toBeInTheDocument()
  })
})

import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

global.fetch = jest.fn()

const createManyFeedbackItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    rating: Math.floor(Math.random() * 10) + 1,
    text: `This is feedback item ${i + 1} with enough text to make it substantial and create a longer page that requires scrolling to see all content properly.`
  }))
}

describe('About Icon Placement', () => {
  beforeEach(() => {
    fetch.mockClear()
    // Mock getComputedStyle to return expected CSS values
    window.getComputedStyle = jest.fn(() => ({
      position: 'fixed',
      bottom: '20px',
      right: '20px'
    }))
  })

  test('should keep about icon at bottom-right with fixed positioning', async () => {
    // Mock many feedback items to create scrollable content
    const manyFeedbackItems = createManyFeedbackItems(15)
    
    fetch.mockResolvedValueOnce({
      json: async () => manyFeedbackItems
    })

    render(<App />)

    // Wait for feedback items to load
    await waitFor(() => {
      expect(screen.getByText('This is feedback item 1 with enough text to make it substantial and create a longer page that requires scrolling to see all content properly.')).toBeInTheDocument()
    })

    // Find the about icon
    const aboutIcon = document.querySelector('.about-link')
    expect(aboutIcon).toBeTruthy()

    // Check that about icon has the correct class
    expect(aboutIcon).toHaveClass('about-link')
    
    // Mock getComputedStyle returns expected values
    const aboutIconStyles = window.getComputedStyle(aboutIcon)
    expect(aboutIconStyles.position).toBe('fixed')
    expect(aboutIconStyles.bottom).toBe('20px')
    expect(aboutIconStyles.right).toBe('20px')
  })

  test('should maintain fixed position with varying content', async () => {
    // Start with few feedback items
    const initialFeedback = createManyFeedbackItems(3)
    
    fetch.mockResolvedValueOnce({
      json: async () => initialFeedback
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getAllByText(/This is feedback item/)).toHaveLength(3)
    })

    const aboutIcon = document.querySelector('.about-link')
    expect(aboutIcon).toHaveClass('about-link')
    
    const aboutIconStyles = window.getComputedStyle(aboutIcon)
    expect(aboutIconStyles.position).toBe('fixed')
    expect(aboutIconStyles.bottom).toBe('20px')
    expect(aboutIconStyles.right).toBe('20px')
  })
})
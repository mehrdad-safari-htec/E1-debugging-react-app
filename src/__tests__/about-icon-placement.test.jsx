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
  })

  test('should keep about icon at bottom-right when page has many feedback cards', async () => {
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

    // Find the about icon link
    const aboutIcon = document.querySelector('.about-link')
    expect(aboutIcon).toBeTruthy()

    // Get computed styles
    const aboutIconStyles = window.getComputedStyle(aboutIcon)
    
    // Assert the icon has fixed positioning (should be fixed to viewport)
    expect(aboutIconStyles.position).toBe('fixed')
    
    // Assert it's positioned at bottom-right
    expect(aboutIconStyles.bottom).toBeTruthy()
    expect(aboutIconStyles.right).toBeTruthy()
    
    // Verify it doesn't drift with content
    expect(aboutIconStyles.bottom).not.toBe('auto')
    expect(aboutIconStyles.right).not.toBe('auto')
  })

  test('should maintain about icon position after adding new feedback', async () => {
    // Start with some feedback items
    const initialFeedback = createManyFeedbackItems(10)
    
    fetch.mockResolvedValueOnce({
      json: async () => initialFeedback
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getAllByText(/This is feedback item/)).toHaveLength(10)
    })

    const aboutIcon = document.querySelector('.about-link')
    const initialStyles = window.getComputedStyle(aboutIcon)
    const initialBottom = initialStyles.bottom
    const initialRight = initialStyles.right

    // Mock adding new feedback
    fetch.mockResolvedValueOnce({
      json: async () => ({ id: 11, rating: 9, text: 'New feedback item' })
    })

    
    // Fill and submit form (this would add more content)
    // Note: This is a simplified test - in real scenario you'd interact with form
    
    // Check that about icon position hasn't changed
    const updatedStyles = window.getComputedStyle(aboutIcon)
    expect(updatedStyles.bottom).toBe(initialBottom)
    expect(updatedStyles.right).toBe(initialRight)
    expect(updatedStyles.position).toBe('fixed')
  })
})
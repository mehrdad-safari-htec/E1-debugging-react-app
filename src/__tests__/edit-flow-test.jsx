import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

global.fetch = jest.fn()

const mockFeedbackData = [
  { id: 1, rating: 10, text: 'This is feedback item 1 coming from the backend' },
  { id: 2, rating: 8, text: 'This is feedback item 2 coming from the backend' }
]

describe('Feedback Edit Flow', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test('should click edit on existing feedback item', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockFeedbackData
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('This is feedback item 1 coming from the backend')).toBeInTheDocument()
    })

    const editButton = document.querySelector('.edit')
    expect(editButton).toBeTruthy()
    fireEvent.click(editButton)
  })

  test('should assert form is prefilled after clicking edit', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockFeedbackData
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('This is feedback item 1 coming from the backend')).toBeInTheDocument()
    })

    const editButton = document.querySelector('.edit')
    fireEvent.click(editButton)

    const textInput = screen.getByPlaceholderText('Write a review')
    expect(textInput.value).toBe('This is feedback item 1 coming from the backend')
    
    const rating10 = screen.getByLabelText('10')
    expect(rating10).toBeChecked()
  })

  test('should complete edit flow then add new feedback', async () => {
    // Mock initial GET request
    fetch.mockResolvedValueOnce({
      json: async () => mockFeedbackData
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('This is feedback item 1 coming from the backend')).toBeInTheDocument()
    })

    // Edit existing feedback
    const editButton = document.querySelector('.edit')
    fireEvent.click(editButton)

    const textInput = screen.getByPlaceholderText('Write a review')
    fireEvent.change(textInput, { target: { value: 'Updated feedback text' } })
    
    const rating7 = screen.getByLabelText('7')
    fireEvent.click(rating7)

    // Mock PUT request for update
    fetch.mockResolvedValueOnce({
      json: async () => ({ id: 1, rating: 7, text: 'Updated feedback text' })
    })

    fireEvent.click(screen.getByText('Send'))

    // Assert item updates
    await waitFor(() => {
      expect(screen.getByText('Updated feedback text')).toBeInTheDocument()
    })

    // Add new feedback after edit
    await waitFor(() => {
      const newTextInput = screen.getByPlaceholderText('Write a review')
      expect(newTextInput.value).toBe('')
    })
    
    const newTextInput = screen.getByPlaceholderText('Write a review')
    fireEvent.change(newTextInput, { target: { value: 'Brand new feedback item' } })
    
    const rating9 = screen.getByLabelText('9')
    fireEvent.click(rating9)

    // Wait for button to be enabled
    await waitFor(() => {
      const sendButton = screen.getByText('Send')
      expect(sendButton).not.toBeDisabled()
    })

    // Mock POST request for new feedback
    fetch.mockResolvedValueOnce({
      json: async () => ({ id: 3, rating: 9, text: 'Brand new feedback item' })
    })

    fireEvent.click(screen.getByText('Send'))

    // Assert new feedback card is added
    await waitFor(() => {
      expect(screen.getByText('Brand new feedback item')).toBeInTheDocument()
    })
  })
})
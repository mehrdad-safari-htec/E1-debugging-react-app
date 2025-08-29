import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../App'
import { FeedbackItem } from '../types'

const mockFetch = vi.fn() as any
global.fetch = mockFetch

const mockFeedbackData: FeedbackItem[] = [
  { id: 1, rating: 10, text: 'This is feedback item 1 coming from the backend' },
  { id: 2, rating: 8, text: 'This is feedback item 2 coming from the backend' }
]

describe('Feedback Edit Flow', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  test('should click edit on existing feedback item', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockFeedbackData
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('This is feedback item 1 coming from the backend')).toBeInTheDocument()
    })

    const editButton = document.querySelector('.edit')
    expect(editButton).toBeTruthy()
    fireEvent.click(editButton!)
  })

  test('should assert form is prefilled after clicking edit', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockFeedbackData
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('This is feedback item 1 coming from the backend')).toBeInTheDocument()
    })

    const editButton = document.querySelector('.edit')
    fireEvent.click(editButton!)

    const textInput = screen.getByPlaceholderText('Write a review') as HTMLInputElement
    expect(textInput.value).toBe('This is feedback item 1 coming from the backend')
    
    const rating10 = screen.getByLabelText('10')
    expect(rating10).toBeChecked()
  })

  test('should complete edit flow then add new feedback', async () => {
    // Mock initial GET request
    mockFetch.mockResolvedValueOnce({
      json: async () => mockFeedbackData
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('This is feedback item 1 coming from the backend')).toBeInTheDocument()
    })

    // Edit existing feedback
    const editButton = document.querySelector('.edit')
    fireEvent.click(editButton!)

    const textInput = screen.getByPlaceholderText('Write a review')
    fireEvent.change(textInput, { target: { value: 'Updated feedback text' } })
    
    const rating7 = screen.getByLabelText('7')
    fireEvent.click(rating7)

    // Mock PUT request for update
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ id: 1, rating: 7, text: 'Updated feedback text' })
    })

    fireEvent.click(screen.getByText('Send'))

    // Assert item updates
    await waitFor(() => {
      expect(screen.getByText('Updated feedback text')).toBeInTheDocument()
    })

    // Add new feedback after edit
    await waitFor(() => {
      const newTextInput = screen.getByPlaceholderText('Write a review') as HTMLInputElement
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
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ id: 3, rating: 9, text: 'Brand new feedback item' })
    })

    fireEvent.click(screen.getByText('Send'))

    // Assert new feedback card is added
    await waitFor(() => {
      expect(screen.getByText('Brand new feedback item')).toBeInTheDocument()
    })
  })

  test('should have correct button CSS classes during edit flow', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockFeedbackData
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('This is feedback item 1 coming from the backend')).toBeInTheDocument()
    })

    // Initially button should be disabled
    const initialButton = screen.getByText('Send')
    expect(initialButton).toBeDisabled()
    expect(initialButton).toHaveClass('btn')
    expect(initialButton).not.toHaveClass('btn-primary')

    // Click edit - button should become enabled with primary class
    const editButton = document.querySelector('.edit')
    fireEvent.click(editButton!)

    await waitFor(() => {
      const editModeButton = screen.getByText('Send')
      expect(editModeButton).not.toBeDisabled()
      expect(editModeButton).toHaveClass('btn', 'btn-primary')
      expect(editModeButton).not.toHaveClass('btn-undefined')
    })

    // Type short text - button should be disabled
    const textInput = screen.getByPlaceholderText('Write a review')
    fireEvent.change(textInput, { target: { value: 'short' } })

    await waitFor(() => {
      const disabledButton = screen.getByText('Send')
      expect(disabledButton).toBeDisabled()
      expect(disabledButton).toHaveClass('btn')
      expect(disabledButton).not.toHaveClass('btn-primary')
    })

    // Type valid text - button should be enabled with primary class
    fireEvent.change(textInput, { target: { value: 'This is a valid long text' } })

    await waitFor(() => {
      const enabledButton = screen.getByText('Send')
      expect(enabledButton).not.toBeDisabled()
      expect(enabledButton).toHaveClass('btn', 'btn-primary')
      expect(enabledButton).not.toHaveClass('btn-undefined')
    })
  })
})
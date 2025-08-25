import { render, screen, fireEvent } from '@testing-library/react'
import RatingSelect from '../components/RatingSelect'

describe('RatingSelect Default Rating Display', () => {
  test('should display default rating of 10 on initial mount', () => {
    const mockOnSelect = jest.fn()
    
    render(<RatingSelect selected={10} onSelect={mockOnSelect} />)
    
    const rating10 = screen.getByLabelText('10')
    expect(rating10).toBeChecked()
    
    // Verify other ratings are not checked
    const rating1 = screen.getByLabelText('1')
    expect(rating1).not.toBeChecked()
  })

  test('should show selected rating when prop is provided', () => {
    const mockOnSelect = jest.fn()
    
    render(<RatingSelect selected={7} onSelect={mockOnSelect} />)
    
    const rating7 = screen.getByLabelText('7')
    expect(rating7).toBeChecked()
    
    const rating10 = screen.getByLabelText('10')
    expect(rating10).not.toBeChecked()
  })

  test('should call onSelect when rating is changed', () => {
    const mockOnSelect = jest.fn()
    
    render(<RatingSelect selected={10} onSelect={mockOnSelect} />)
    
    const rating5 = screen.getByLabelText('5')
    fireEvent.click(rating5)
    
    expect(mockOnSelect).toHaveBeenCalledWith(5)
  })

  test('should render all rating options using iteration', () => {
    const mockOnSelect = jest.fn()
    
    render(<RatingSelect selected={10} onSelect={mockOnSelect} />)
    
    for (let i = 1; i <= 10; i++) {
      const rating = screen.getByLabelText(i.toString())
      expect(rating).toBeInTheDocument()
      expect(rating).toHaveAttribute('value', i.toString())
    }
  })

  test('should update selection when selected prop changes', () => {
    const mockOnSelect = jest.fn()
    const { rerender } = render(<RatingSelect selected={10} onSelect={mockOnSelect} />)
    
    expect(screen.getByLabelText('10')).toBeChecked()
    
    rerender(<RatingSelect selected={3} onSelect={mockOnSelect} />)
    
    expect(screen.getByLabelText('3')).toBeChecked()
    expect(screen.getByLabelText('10')).not.toBeChecked()
  })

  test('should work as controlled component without internal state', () => {
    const mockOnSelect = jest.fn()
    
    render(<RatingSelect selected={8} onSelect={mockOnSelect} />)
    
    // Initial state should match prop
    expect(screen.getByLabelText('8')).toBeChecked()
    
    // Click should call onSelect but not change internal state
    const rating6 = screen.getByLabelText('6')
    fireEvent.click(rating6)
    
    expect(mockOnSelect).toHaveBeenCalledWith(6)
    // Component should still show original selected value until prop changes
    expect(screen.getByLabelText('8')).toBeChecked()
  })
})
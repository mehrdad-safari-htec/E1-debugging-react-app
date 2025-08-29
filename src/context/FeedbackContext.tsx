import { createContext, useState, useEffect, ReactNode } from 'react'
import { FeedbackItem, FeedbackEdit, FeedbackContextType } from '../types'

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

interface FeedbackProviderProps {
  children: ReactNode
}

export const FeedbackProvider = ({ children }: FeedbackProviderProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [feedbackEdit, setFeedbackEdit] = useState<FeedbackEdit>({
    item: {},
    edit: false,
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  // Fetch feedback
  const fetchFeedback = async () => {
    const response = await fetch(`/feedback?_sort=id&_order=desc`)
    const data: FeedbackItem[] = await response.json()

    setFeedback(data)
    setIsLoading(false)
  }

  // Add feedback
  const addFeedback = async (newFeedback: Omit<FeedbackItem, 'id'>) => {
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    })

    const data: FeedbackItem = await response.json()

    setFeedback([data, ...feedback])
  }

  // Delete feedback
  const deleteFeedback = async (id: number) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await fetch(`/feedback/${id}`, { method: 'DELETE' })

      setFeedback(feedback.filter((item) => item.id !== id))
    }
  }

  // Update feedback item
  const updateFeedback = async (id: number, updItem: Omit<FeedbackItem, 'id'>) => {
    const response = await fetch(`/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem),
    })

    const data: FeedbackItem = await response.json()

    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
    )
    
    // Clear edit state after successful update
    setFeedbackEdit({
      item: {},
      edit: false,
    })
  }

  // Set item to be updated
  const editFeedback = (item: FeedbackItem) => {
    setFeedbackEdit({
      item,
      edit: true,
    })
  }

  // Clear edit state
  const clearEditState = () => {
    setFeedbackEdit({
      item: {},
      edit: false,
    })
  }

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
        clearEditState,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext
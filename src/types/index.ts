export interface FeedbackItem {
  id: number
  rating: number
  text: string
}

export interface FeedbackEdit {
  item: Partial<FeedbackItem>
  edit: boolean
}

export interface FeedbackContextType {
  feedback: FeedbackItem[]
  feedbackEdit: FeedbackEdit
  isLoading: boolean
  deleteFeedback: (id: number) => Promise<void>
  addFeedback: (newFeedback: Omit<FeedbackItem, 'id'>) => Promise<void>
  editFeedback: (item: FeedbackItem) => void
  updateFeedback: (id: number, updItem: Omit<FeedbackItem, 'id'>) => Promise<void>
  clearEditState: () => void
}
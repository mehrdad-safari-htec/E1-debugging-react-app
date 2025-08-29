import { FaTimes, FaEdit } from 'react-icons/fa'
import { useContext } from 'react'
import Card from './shared/Card'
import FeedbackContext from '../context/FeedbackContext'
import { FeedbackItem as FeedbackItemType } from '../types'

interface FeedbackItemProps {
  item: FeedbackItemType
}

function FeedbackItem({ item }: FeedbackItemProps) {
  const context = useContext(FeedbackContext)
  if (!context) throw new Error('FeedbackItem must be used within FeedbackProvider')
  const { deleteFeedback, editFeedback } = context

  return (
    <Card>
      <div className='num-display'>{item.rating}</div>
      <button onClick={() => deleteFeedback(item.id)} className='close'>
        <FaTimes color='purple' />
      </button>
      <button onClick={() => editFeedback(item)} className='edit'>
        <FaEdit color='purple' />
      </button>
      <div className='text-display'>{item.text}</div>
    </Card>
  )
}

export default FeedbackItem

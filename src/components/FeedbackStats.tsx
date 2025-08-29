import { useContext } from 'react'
import FeedbackContext from '../context/FeedbackContext'

function FeedbackStats() {
  const context = useContext(FeedbackContext)
  if (!context) throw new Error('FeedbackStats must be used within FeedbackProvider')
  const { feedback } = context

  // Calculate ratings avg
  let average: number | string =
    feedback.reduce((acc, cur) => {
      return acc + cur.rating
    }, 0) / feedback.length

  average = average.toFixed(1).replace(/[.,]0$/, '')

  return (
    <div className='feedback-stats'>
      <h4>{feedback.length} Reviews</h4>
      <h4>Average Rating: {isNaN(Number(average)) ? 0 : average}</h4>
    </div>
  )
}

export default FeedbackStats

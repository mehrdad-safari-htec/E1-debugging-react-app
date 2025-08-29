import { useState, useContext, useEffect, FormEvent, ChangeEvent } from 'react'
import RatingSelect from './RatingSelect'
import Card from './shared/Card'
import Button from './shared/Button'
import FeedbackContext from '../context/FeedbackContext'

function FeedbackForm() {
  const [text, setText] = useState('')
  const [rating, setRating] = useState(10)
  const [btnDisabled, setBtnDisabled] = useState(true)
  const [message, setMessage] = useState<string | null>('')

  const context = useContext(FeedbackContext)
  if (!context) throw new Error('FeedbackForm must be used within FeedbackProvider')
  const { addFeedback, feedbackEdit, updateFeedback } = context

  useEffect(() => {
    if (feedbackEdit.edit === true) {
      setBtnDisabled(false)
      setText(feedbackEdit.item.text || '')
      setRating(feedbackEdit.item.rating || 10)
    } else {
      setRating(10)
    }
  }, [feedbackEdit])

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    setText(newText)
    
    if (newText === '') {
      setBtnDisabled(true)
      setMessage(null)
    } else if (newText !== '' && newText.trim().length <= 10) {
      setMessage('Text must be at least 10 characters')
      setBtnDisabled(true)
    } else {
      setMessage(null)
      setBtnDisabled(false)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (text.trim().length > 10) {
      const newFeedback = {
        text,
        rating,
      }

      if (feedbackEdit.edit === true && feedbackEdit.item.id) {
        updateFeedback(feedbackEdit.item.id, newFeedback)
      } else {
        addFeedback(newFeedback)
      }

      setText('')
      setRating(10)
      setBtnDisabled(true)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h2>How would you rate your service with us?</h2>
        <RatingSelect selected={rating} onSelect={(rating: number) => setRating(rating)} />
        <div className='input-group'>
          <input
            onChange={handleTextChange}
            type='text'
            placeholder='Write a review'
            value={text}
          />
          <Button type='submit' version='primary' isDisabled={btnDisabled}>
            Send
          </Button>
        </div>

        {message && <div className='message'>{message}</div>}
      </form>
    </Card>
  )
}

export default FeedbackForm
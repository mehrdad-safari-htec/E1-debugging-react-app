import { ChangeEvent } from 'react'

interface RatingSelectProps {
  selected: number
  onSelect: (rating: number) => void
}

function RatingSelect({ selected, onSelect }: RatingSelectProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSelect(+e.currentTarget.value)
  }

  return (
    <ul className='rating'>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
        <li key={num}>
          <input
            type='radio'
            id={`num${num}`}
            name='rating'
            value={num}
            onChange={handleChange}
            checked={selected === num}
          />
          <label htmlFor={`num${num}`}>{num}</label>
        </li>
      ))}
    </ul>
  )
}

export default RatingSelect

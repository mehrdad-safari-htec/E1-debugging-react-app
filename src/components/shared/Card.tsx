import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  reverse?: boolean
}

function Card({ children, reverse = false }: CardProps) {
  return (
    <div
      className='card'
      style={{
        backgroundColor: reverse ? 'rgba(0,0,0,0.4)' : '#fff',
        color: reverse ? '#fff' : '#000',
      }}
    >
      {children}
    </div>
  )
}

export default Card

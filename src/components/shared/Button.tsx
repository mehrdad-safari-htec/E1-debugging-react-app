import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  version?: string
  type?: 'button' | 'submit' | 'reset'
  isDisabled?: boolean
}

function Button({ children, version = 'primary', type = 'button', isDisabled = false }: ButtonProps) {
  return (
    <button 
      type={type} 
      disabled={isDisabled} 
      className={`btn ${isDisabled ? '' : `btn-${version}`}`}
    >
      {children}
    </button>
  )
}

export default Button

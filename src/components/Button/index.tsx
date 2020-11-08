import React, { ButtonHTMLAttributes } from 'react'

import { Button as MyButton } from './styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  primary = false,
  ...rest
}) => {
  return (
    <MyButton className={primary ? 'primary' : undefined} {...rest}>
      {children}
    </MyButton>
  )
}

export default Button

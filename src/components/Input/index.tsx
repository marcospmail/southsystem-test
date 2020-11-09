import React, { CSSProperties, forwardRef, InputHTMLAttributes } from 'react'

import { Container } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerStyle?: CSSProperties
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { children, containerStyle, ...rest },
  ref
) => {
  return (
    <Container data-testid="testid_container" style={containerStyle}>
      {children}
      <input ref={ref} {...rest} />
    </Container>
  )
}

export default forwardRef(Input)

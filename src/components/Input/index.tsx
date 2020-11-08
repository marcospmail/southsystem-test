import React, { forwardRef, InputHTMLAttributes } from 'react'

import { Container } from './styles'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { ...rest },
  ref
) => {
  return <Container ref={ref} {...rest} />
}

export default forwardRef(Input)

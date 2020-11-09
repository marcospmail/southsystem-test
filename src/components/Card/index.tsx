import React, { CSSProperties, HTMLAttributes } from 'react'

import { Container } from './styles'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc?: string
  text: string
  textStyle?: CSSProperties
}

const Card: React.FC<CardProps> = ({ imgSrc, text, textStyle, ...rest }) => {
  return (
    <Container data-testid="testid_container" {...rest}>
      <span style={{ ...textStyle }}>{text}</span>
      {imgSrc && <img src={imgSrc} />}
    </Container>
  )
}

export default Card

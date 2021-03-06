import React from 'react'

import Card from '../../components/Card'

import abductionImg from '../../assets/abduction.svg'

import { Container } from './styles'

const Empty: React.FC = () => {
  return (
    <Container>
      <Card text="You shouldn't be here." imgSrc={abductionImg} />
    </Container>
  )
}

export default Empty

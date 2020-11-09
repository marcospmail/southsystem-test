import React from 'react'
import { Link } from 'react-router-dom'

import { Container } from './styles'

const Header: React.FC = () => {
  return (
    <Container>
      <Link to="/">
        <strong>SouthSystem-test</strong>
      </Link>
    </Container>
  )
}

export default Header

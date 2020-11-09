import React from 'react'
import { render } from '@testing-library/react'

import Button from '../../components/Button'

describe('Button Component', () => {
  it('should show button', () => {
    const buttonText = 'Test'

    const { getByText } = render(<Button>{buttonText}</Button>)

    const component = getByText(buttonText)

    expect(component).toBeTruthy()
  })

  it('should have #4167df background color if primary', () => {
    const buttonText = 'Test'

    const { getByText } = render(<Button primary>{buttonText}</Button>)

    const component = getByText(buttonText)

    expect(component).toHaveStyle('background: #3f3d56')
  })

  it('should have #ddd background color if not primary', () => {
    const buttonText = 'Test'

    const { getByText } = render(<Button>{buttonText}</Button>)

    const component = getByText(buttonText)

    expect(component).toHaveStyle('background: #ddd')
  })
})

import React from 'react'
import { render } from '@testing-library/react'

import Input from '../../components/Input'

describe('Input Component', () => {
  it('should contain container with style passed by containerStyle property', () => {
    const containerStyle = { backgroundColor: 'blue', border: '1px solid red' }

    const { getByTestId } = render(<Input containerStyle={containerStyle} />)

    for (const [atr, value] of Object.entries(containerStyle)) {
      expect(getByTestId('testid_container')).toHaveStyle(`${atr}: ${value}`)
    }
  })

  it('should contain children', () => {
    const childrenText = 'hello, im a text inside a span'

    const { container, getByText } = render(
      <Input>
        <span>{childrenText}</span>
      </Input>
    )

    expect(container).toContainElement(getByText(childrenText))
  })

  it('should contain an input with attributes passed by props', () => {
    const id = 'id_mock'
    const defaultValue = 'value_mock'

    const { container } = render(<Input id={id} defaultValue={defaultValue} />)

    const input = container.querySelector('input')

    expect(input).toHaveAttribute('id', id)
    expect(input).toHaveAttribute('value', defaultValue)
  })
})

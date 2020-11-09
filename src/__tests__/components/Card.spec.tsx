import React from 'react'
import { render } from '@testing-library/react'

import Card from '../../components/Card'

describe('Card Component', () => {
  it('should show text passed by prop', () => {
    const textProp = 'Must show this text'

    const { container } = render(<Card text={textProp} />)

    expect(container).toHaveTextContent(textProp)
  })

  it('should contain a image if passed imgSrc prop', () => {
    const textProp = 'Must show this text'
    const imageSource = 'image_src_mock'

    const { container } = render(<Card text={textProp} imgSrc={imageSource} />)

    expect(container.querySelector('img')).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('src', imageSource)
  })

  it('should contain text with style passed by textStyle prop', () => {
    const textProp = 'Must show this text'
    const textStyle = { color: 'blue', fontSize: 22 }

    const { container } = render(<Card text={textProp} textStyle={textStyle} />)

    for (const [atr, value] of Object.entries(textStyle)) {
      expect(container.querySelector('span')).toHaveStyle(`${atr}: ${value}`)
    }
  })

  it('should contain container with attributes passed by props', () => {
    const textProp = 'Must show this text'
    const id = 'id_mock'

    const { getByTestId } = render(<Card text={textProp} id={id} />)

    expect(getByTestId('testid_container')).toHaveAttribute('id', id)
  })
})
